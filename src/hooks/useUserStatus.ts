import { useEffect } from "react";
import { ref, onDisconnect, set, onValue } from "firebase/database";
import { auth, realtimeDb } from "../firebase/firebase"; // Importuj realTimeDB iz firebase config-a
import { onAuthStateChanged } from "firebase/auth";

const useUserStatus = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userStatusRef = ref(realtimeDb, `/status/${user?.uid}`);

      //ukoliko se korisnik konektuje tj uspostavi vezu sa bazom koristimo firebaseovu realtim db ./info proveravamo da li je veza uspostavljena i azuriramo nasu bazu na "connected"
      const connectionRef = ref(realtimeDb, ".info/connected");
      onValue(connectionRef, (snapshot) => {
        if (snapshot.val() === true) {
          set(userStatusRef, {
            state: "connected",
          });
        }
      });

      // postavljam da bude disconected kad se korisnik diskonektuje ili izgubi na bilo koji nacin vezu sa bazom
      onDisconnect(userStatusRef).set({
        state: "disconnected",
      });
    });

    return () => unsubscribe();
  }, []);
};

export default useUserStatus;
