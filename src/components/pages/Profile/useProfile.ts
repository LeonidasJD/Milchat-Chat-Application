import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase.ts";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/slice/userSlice.ts";
import { MyUser } from "../../../redux/types/myUserType.ts";
import {
  getAuth,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ProfileName, ProfileEmail } from "./types/profileTypes.tsx";
import { toast } from "react-hot-toast";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const useProfile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] =
    useState<boolean>(false);
  const [successResetPassword, setSuccessResetPassword] =
    useState<boolean>(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();

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
          setIsLoading(false);
        } else {
          dispatch(setCurrentUser(null));
        }
      } catch (error) {
        toast.error("Something went wrong, please try again!");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  //handle open change profile modal
  const handleOpenChangeProfileModal = (currentUserName: string) => {
    setModalOpen(true);
    resetChangeProfile({ name: currentUserName });
  };

  //handle close change profile modal
  const handleCloseChangeProfileModal = () => {
    setModalOpen(false);
  };

  // register forms
  const {
    control: controlChangeProfile,
    handleSubmit: handleSubmitChangeProfile,
    formState: { errors: errorsChangeProfile },
    reset: resetChangeProfile,
  } = useForm<ProfileName>();

  const {
    control: controlResetPassword,
    handleSubmit: handleSubmitResetPassword,
    formState: { errors: errorsResetPassword },
    reset: resetResetPassword,
  } = useForm<ProfileEmail>();

  //change profile name
  const updateUserProfile = (data: ProfileName) => {
    const auth = getAuth();

    if (auth.currentUser) {
      const newDisplayName = data.name;

      updateProfile(auth.currentUser, {
        displayName: newDisplayName,
      })
        .then(() => {
          const updatedUser: MyUser = {
            displayName: newDisplayName, // UPDATED DISPLAY NAME
            email: auth.currentUser?.email || "",
            emailVerified: auth.currentUser?.emailVerified ?? false,
            isAnonymous: auth.currentUser?.isAnonymous ?? false,
            userName: newDisplayName,
            metadata: {
              creationTime: auth.currentUser?.metadata.creationTime || "",
              lastSignInTime: auth.currentUser?.metadata.lastSignInTime || "",
            },
            phoneNumber: auth.currentUser?.phoneNumber || "",
            photoURL: auth.currentUser?.photoURL || "",
            uid: auth.currentUser?.uid || "",
          };

          if (auth.currentUser?.uid) {
            updateDoc(doc(db, "users", auth.currentUser.uid), {
              name: newDisplayName,
            });
          }

          dispatch(setCurrentUser(updatedUser));
          setModalOpen(false);
          toast.success("Profile name updated successfully!");
        })
        .catch(() => {
          toast.error("Something went wrong, please try again!");
        });
    }
  };

  //handle open reset password modal
  const handleOpenResetPasswordModal = () => {
    setResetPasswordModalOpen(true);
  };
  //handle close reset password modal
  const handleCloseResetPasswordModal = () => {
    setResetPasswordModalOpen(false);
    setSuccessResetPassword(false);
    resetResetPassword();
  };

  //reset password
  const handleResetPassword = (data: ProfileEmail) => {
    const auth = getAuth();

    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        resetResetPassword();
        setSuccessResetPassword(true);
        toast.success("Password reset email sent successfully!");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          toast.error("This email is not registered.");
        }
      });
  };

  //handle open delete user modal
  const handleOpenDeleteUserModal = () => {
    setDeleteUserModalOpen(true);
  };

  //handle close delete user modal
  const handleCloseDeleteUserModal = () => {
    setDeleteUserModalOpen(false);
  };

  //delete user
  const handleDeleteUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);

      //brisanje korisnika iz kolekcije users
      deleteDoc(docRef).then(() => {
        //firebase cloud function za brisanje korisnika
        deleteUser(user)
          .then(() => {
            toast.success("User deleted successfully!");

            dispatch(setCurrentUser(null));
            setDeleteUserModalOpen(false);

            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 1000);
          })
          .catch((error) => {
            toast.error("Something went wrong, please try again!", error);
          });
      });
    } else {
      toast.error("No user is currently signed in.");
    }
  };

  return {
    updateUserProfile,
    handleOpenChangeProfileModal,
    handleCloseChangeProfileModal,
    handleOpenResetPasswordModal,
    handleCloseResetPasswordModal,
    modalOpen,
    resetPasswordModalOpen,
    controlChangeProfile,
    handleSubmitChangeProfile,
    errorsChangeProfile,
    controlResetPassword,
    handleSubmitResetPassword,
    errorsResetPassword,
    handleResetPassword,
    successResetPassword,
    handleDeleteUser,
    deleteUserModalOpen,
    handleOpenDeleteUserModal,
    handleCloseDeleteUserModal,
    isLoading,
  };
};
export default useProfile;
