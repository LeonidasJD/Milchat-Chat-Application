import { useEffect } from "react";
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { auth, realtimeDb } from "../firebase/firebase"; // Importuj realTimeDB iz firebase config-a
import { onAuthStateChanged } from "firebase/auth";

const useUserStatus = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userStatusRef = ref(realtimeDb, `/status/${user?.uid}`);

      if (!user) {
        // Ako nema korisnika (logout), postavi status na "offline"
        set(userStatusRef, {
          state: "offline",
          lastChanged: serverTimestamp(),
        });
      } else {
        // Ako korisnik postoji, postavi status na "online"
        set(userStatusRef, {
          state: "online",
          lastChanged: serverTimestamp(),
        });
      }

      // Postavi da bude offline kad se korisnik diskonektuje
      onDisconnect(userStatusRef).set({
        state: "offline",
        lastChanged: serverTimestamp(),
      });
    });

    return () => unsubscribe();
  }, []);
};

export default useUserStatus;
