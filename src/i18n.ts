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
