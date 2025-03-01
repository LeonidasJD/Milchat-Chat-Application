import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { UsersList } from "./types/allUsersType";
import toast from "react-hot-toast";
import GlobalLoader from "../global-loader/global-loader";
import { setSelectedUserData } from "../../../redux/slice/selectedUserSlice";
import "./allUsers.scss";
import { useDispatch } from "react-redux";

const UserList = () => {
  const [allUsersList, setAllUsersList] = useState<UsersList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");

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

  const filteredUsers = allUsersList.filter(
    (user) => user.id !== auth.currentUser?.uid
  );

  return (
    <div className="all-users-container">
      <h1>All Users</h1>
      {isLoading ? (
        <GlobalLoader />
      ) : (
        <div className="all-users-list">
          <ul className="users-information">
            {filteredUsers.map((user) => (
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
        </div>
      )}
    </div>
  );
};

export default UserList;
