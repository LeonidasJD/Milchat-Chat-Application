import { useEffect } from "react";
import {
  ref,
  onDisconnect,
  set,
  serverTimestamp,
  onValue,
} from "firebase/database";
import { auth, realtimeDb } from "../firebase/firebase"; // Importuj realTimeDB iz firebase config-a
import { onAuthStateChanged } from "firebase/auth";

const useUserStatus = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const userStatusRef = ref(realtimeDb, `/status/${user?.uid}`);

      const connectionRef = ref(realtimeDb, ".info/connected");
      onValue(connectionRef, (snapshot) => {
        if (snapshot.val() === true) {
          set(userStatusRef, {
            state: "connected",
            lastChanged: serverTimestamp(),
          });
        }
      });

      // Postavi da bude offline kad se korisnik diskonektuje
      onDisconnect(userStatusRef).set({
        state: "disconnected",
        lastChanged: serverTimestamp(),
      });
    });

    return () => unsubscribe();
  }, []);
};

export default useUserStatus;
