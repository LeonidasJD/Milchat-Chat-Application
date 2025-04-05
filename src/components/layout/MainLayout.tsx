import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import BottomBar from "./BottomBar";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MyUser } from "../../redux/types/myUserType";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/slice/userSlice";
import "./mainLayout.scss";
import toast from "react-hot-toast";
import useUserStatus from "../../hooks/useUserStatus";

const MainLayout = () => {
  useUserStatus();
  const dispatch = useDispatch();

  //kada refreshujemo aplikaciju na globalnom nivou azuriramo redux sa trenutnim korisnikom
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser && auth.currentUser?.uid) {
          const docRef = doc(db, "users", auth.currentUser?.uid);
          const userResult = await getDoc(docRef);

          const mappedUser: MyUser = {
            displayName: currentUser.displayName || "",
            email: currentUser.email || "",
            emailVerified: currentUser.emailVerified,
            isAnonymous: currentUser.isAnonymous,
            userName: userResult.data()?.name || "",
            metadata: {
              creationTime: currentUser.metadata.creationTime || "",
              lastSignInTime: currentUser.metadata.lastSignInTime || "",
            },
            phoneNumber: currentUser.phoneNumber || "",
            photoURL: currentUser.photoURL || "",
            uid: currentUser.uid || "",
          };

          dispatch(setCurrentUser(mappedUser));
        } else {
          dispatch(setCurrentUser(null));
        }
      } catch (error) {
        toast.error("Something went wrong, please try again!");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="main-layout" style={{ display: "flex" }}>
      <SideNav />
      <main className="main-content">
        <Outlet />
        <BottomBar />
      </main>
    </div>
  );
};

export default MainLayout;
