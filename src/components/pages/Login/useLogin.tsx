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
import { doc, setDoc } from "firebase/firestore";

const useLogin = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

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
    try {
      const signUpResults = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // kada  korisnik napravi nalog upisujemo u bazu u kolekciju users upisujemo podatke o id korisnika i o emailu korisnika
      const signUpUserId = signUpResults.user.uid;

      await setDoc(doc(db, "users", signUpUserId), {
        id: signUpUserId,
        email: data.email,
      });
      setUserCreated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitLogin = async (data: LoginFormValues) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      setIsLoggedIn(true);
      console.log("current user", auth.currentUser);
      navigate("/");
    } catch (error: unknown) {
      console.error("Error during login:", error);
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
      await signOut(auth);
      console.log("current user", auth.currentUser); //IF USER IS NULL IT IS CORRECT LOGOUT
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Error during logout:", error.message);
      }
    }
  };

  return {
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
