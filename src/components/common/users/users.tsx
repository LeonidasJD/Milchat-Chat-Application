import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase";
import { UsersList } from "./types/allUsersType";
import toast from "react-hot-toast";
import GlobalLoader from "../global-loader/global-loader";
import "./allUsers.scss";

const UserList = () => {
  const [allUsersList, setAllUsersList] = useState<UsersList>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // funkcija za preuzimanje svih registrovanih korisnika
    const fetchUsers = async () => {
      try {
        const usersResult = await getDocs(collection(db, "users"));
        const usersList = usersResult.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
        }));
        setAllUsersList(usersList);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching users");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(allUsersList);

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
              <li key={user.id}>
                <p>{user.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserList;
