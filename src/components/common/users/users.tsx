import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { UsersList } from "./types/allUsersType";
import toast from "react-hot-toast";
import GlobalLoader from "../global-loader/global-loader";
import { setSelectedUserData } from "../../../redux/slice/selectedUserSlice";
import "./allUsers.scss";
import { useDispatch } from "react-redux";
import { Input } from "antd";

const UserList = () => {
  const [allUsersList, setAllUsersList] = useState<UsersList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [finalFilteredUsers, setFinalFilteredUsers] = useState<UsersList>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // funkcija za preuzimanje svih registrovanih korisnika
    //koristimo onSnapshot listener za realtime update podataka
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          isOnline: doc.data().isOnline,
        }));
        setAllUsersList(usersList);
        setIsLoading(false);
      },
      (error) => {
        toast.error("Error fetching users");
        setIsLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener-a
  }, []);

  const onSelectUser = (selectedUserId: string) => {
    setSelectedUser(selectedUserId);

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
        <h1>All Friends</h1>
        <Input.Search
          placeholder="Search friend"
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      {isLoading ? (
        <GlobalLoader />
      ) : (
        <div className="all-users-list">
          {hasUsers ? (
            <ul className="users-information">
              {usersToDisplay.map((user) => (
                <li key={user.id} onClick={() => onSelectUser(user.id)}>
                  <p>{user.name}</p>
                  <span
                    style={{
                      backgroundColor: user.isOnline ? "green" : "red",
                    }}
                    className={`user-status ${
                      user.isOnline ? "online" : "offline"
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
