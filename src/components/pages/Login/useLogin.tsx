import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignUpFormValues,
  LoginFormValues,
} from "../../../types/loginSignUpTypes/loginSignUpTypes";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  getAuth,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { auth, db } from "../../../firebase/firebase.ts";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { MyUser } from "../../../redux/types/myUserType.ts";
import { useDispatch } from "react-redux";
import { resetUser, setCurrentUser } from "../../../redux/slice/userSlice.ts";

const useLogin = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    control: controlSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
  } = useForm<SignUpFormValues>();

  const {
    control: controlLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<LoginFormValues>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSubmitSignUp = async (data: SignUpFormValues) => {
    setIsLoading(true);
    const formattedDate = dayjs(data.dateOfBirth).format("YYYY-MM-DD");

    try {
      const signUpResults = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // kada  korisnik napravi nalog upisujemo u bazu u kolekciju users upisujemo podatke o id korisnika i o emailu korisnika
      const signUpUserId = signUpResults.user.uid;

      await setDoc(doc(db, "users", signUpUserId), {
        name: data.name,
        dateOfBirth: formattedDate,
        id: signUpUserId,
        email: data.email,
      });
      setUserCreated(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      //firebase cloud funkcija za login korisnika
      const loginResults = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const loginUser = loginResults.user;

      //kada se korisnik uloguje upisujemo u bazu da je online
      if (loginUser && auth.currentUser?.uid) {
        updateDoc(doc(db, "users", auth.currentUser?.uid), {
          isOnline: true,
        });
      }

      //kada se korisnik uloguje fetchujemo podatke o korisniku u prosledjujemo u redux kako bi protected ruta znala da li je korisnik logovan ili ne

      if (loginUser && auth.currentUser?.uid) {
        const docRef = doc(db, "users", auth.currentUser?.uid);
        const userResult = await getDoc(docRef);

        const mappedUser: MyUser = {
          displayName: loginUser.displayName || "",
          email: loginUser.email || "",
          emailVerified: loginUser.emailVerified,
          isAnonymous: loginUser.isAnonymous,
          userName: userResult.data()?.name || "",
          metadata: {
            creationTime: loginUser.metadata.creationTime || "",
            lastSignInTime: loginUser.metadata.lastSignInTime || "",
          },
          phoneNumber: loginUser.phoneNumber || "",
          photoURL: loginUser.photoURL || "",
          uid: loginUser.uid || "",
        };

        await dispatch(setCurrentUser(mappedUser));
        navigate("/");
      } else {
        dispatch(setCurrentUser(null));
      }

      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error: unknown) {
      //ALL ERRORS ARE FROM FIREBASE DOCS
      if (error instanceof FirebaseError) {
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          setErrorMessage(
            "Invalid credentials. Please check your email and password."
          );
        } else if (error.message === "Firebase: Error (auth/user-not-found).") {
          setErrorMessage("No user found with this email.");
        } else if (error.message === "Firebase: Error (auth/wrong-password).") {
          setErrorMessage("Incorrect password. Please try again.");
        } else if (error.message === "Firebase: Error (auth/invalid-email).") {
          setErrorMessage("Invalid email. Please enter a valid email address.");
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
      }
    }
  };

  const onSubmitLogout = async () => {
    const auth = getAuth();

    try {
      if (auth.currentUser?.uid) {
        await updateDoc(doc(db, "users", auth.currentUser?.uid), {
          isOnline: false,
        });
      }
      await signOut(auth);
      console.log("current user", auth.currentUser); //IF USER IS NULL IT IS CORRECT LOGOUT
      dispatch(resetUser());

      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Error during logout:", error.message);
      }
    }
  };

  return {
    isLoading,
    controlSignUp,
    handleSubmitSignUp,
    onSubmitSignUp,
    errorsSignUp,
    isLogin,
    setIsLogin,
    controlLogin,
    handleSubmitLogin,
    errorsLogin,
    onSubmitLogin,
    isLoggedIn,
    userCreated,
    errorMessage,
    onSubmitLogout,
  };
};

export default useLogin;
