import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      headerSignUp: "Sign Up For Free",
      headerLogin: "Login",
      serbianLang: "Srpski",
      englishLang: "Engleski",
      login: "LOGIN",
      email: "Email",
      password: "Password",
      loading: "Loading...",
      invalidEmailError: "Invalid email. Please enter a valid email address.",
      invalidCredentialsError:
        "Invalid credentials. Please check your email and password.",
      noUserFoundError: "No user found with this email.",
      incorrectPasswordError: "Incorrect password. Please try again.",
      unexceptedError: "An unexpected error occurred. Please try again later.",
      requiredEmailError: "Email is required*",
      requiredPasswordError: "Password is required*",
      enterEmailAddress: "Enter your email address",
      enterPassword: "Enter your password",
    },
  },
  sr: {
    translation: {
      headerSignUp: "Registruj se",
      headerLogin: "Prijavi se",
      serbianLang: "Serbian",
      englishLang: "English",
      login: "PRIJAVI SE",
      email: "Mejl",
      password: "Lozinka",
      loading: "Molimo Sačekajte...",
      invalidEmailError: "Neispravan mejl. Molimo unesite mejl ponovo.",
      invalidCredentialsError: "Molimo proverite vašu mejl adresu i lozinku.",
      noUserFoundError: "Nije pronadjen korisnik sa tom mejl adresom.",
      incorrectPasswordError: "Pogrešna lozinka. Molimo pokusajte ponovo.",
      unexceptedError:
        "Dogodila se neočekivana greška. Molio pokušajte ponovo.",
      requiredEmailError: "Mejl je obavezan*",
      requiredPasswordError: "Lozinka je obavezna*",
      enterEmailAddress: "Unesite vašu mejl adresu",
      enterPassword: "Unesite vašu lozinku",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Defaultni jezik
  fallbackLng: "en", // Ako nema prevoda, koristi engleski
  interpolation: {
    escapeValue: false, // Omogućava HTML u prevodima
  },
});

export default i18n;
