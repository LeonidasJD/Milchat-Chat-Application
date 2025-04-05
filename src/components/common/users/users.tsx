import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, realtimeDb } from "../../../firebase/firebase";
import { UsersList } from "./types/allUsersType";
import toast from "react-hot-toast";
import GlobalLoader from "../global-loader/global-loader";
import { setSelectedUserData } from "../../../redux/slice/selectedUserSlice";
import "./allUsers.scss";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { onValue, ref } from "firebase/database";

interface UserListProps {
  onCloseModal?: () => void;
}

const UserList: React.FC<UserListProps> = ({ onCloseModal }) => {
  const [allUsersList, setAllUsersList] = useState<UsersList>([]);
  const [usersFromFirestore, setUsersFromFirestore] = useState<UsersList>([]);
  const [statuses, setStatuses] = useState<Record<string, { state: string }>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [finalFilteredUsers, setFinalFilteredUsers] = useState<UsersList>([]);
  const { isDesktop } = useMediaQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          isOnline: doc.data().isOnline,
        }));
        setUsersFromFirestore(usersList);
      },
      () => toast.error("Error fetching users")
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const statusRef = ref(realtimeDb, "/status");

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const statusesData = snapshot.val() || {};
      setStatuses(statusesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const merged = usersFromFirestore.map((user) => ({
      ...user,
      status: statuses[user.id]?.state || "disconnected",
    }));

    setAllUsersList(merged);
  }, [usersFromFirestore, statuses]);

  const onSelectUser = (selectedUserId: string) => {
    const selectedUserName = allUsersList.find(
      (user) => user.id === selectedUserId
    )?.name;

    dispatch(
      setSelectedUserData({
        userId: selectedUserId,
        userName: selectedUserName ? selectedUserName : null,
      })
    );
  };

  // filtriranje korisnika tako da iskljuci trenutno prijavljenog korisnika
  const filteredUsers = allUsersList.filter(
    (user) => user.id !== auth.currentUser?.uid
  );

  //funkcija koja na onChange pretrazuje filtrirane korisnike iz varijable iznad tako da ispisuje samo korisnike koje pretrazimo
  const onSearch = (searchText: string) => {
    setSearchText(searchText);
    const finallUsers = filteredUsers.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFinalFilteredUsers(finallUsers);
  };

  // prikazivanje korisnika u zavisnosti od toga da li je nesto upisano u search input
  const usersToDisplay =
    searchText.length > 0 ? finalFilteredUsers : filteredUsers;
  const hasUsers = usersToDisplay.length > 0;

  return (
    <div className="all-users-container">
      <div className="all-users-header">
        {isDesktop && <h1>All Friends</h1>}

        <Input.Search
          className="search-input"
          placeholder="Search friend"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <GlobalLoader />
      ) : (
        <div className="all-users-list">
          {hasUsers ? (
            <ul className="users-information">
              {usersToDisplay.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user.id);
                    onCloseModal?.();
                  }}
                >
                  <p>{user.name}</p>
                  <span
                    style={{
                      backgroundColor:
                        user.status === "connected" ? "green" : "red",
                    }}
                    className={`user-status ${
                      user.status ? "connected" : "disconnected"
                    }`}
                  ></span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-user-found">No friend found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
