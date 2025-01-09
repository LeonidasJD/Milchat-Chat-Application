import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useDispatch } from "react-redux";
import { setAboutUsText } from "../../../redux/slice/aboutUsSlice";
import { AboutUs } from "../../../redux/types/aboutUsType";
const useAboutUs = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const docRef = doc(db, "aboutUsDatabase", "vc3Va3WqTpFiVjSszaf6"); //collection name and id from firestore in firebase

        const aboutUsResult = await getDoc(docRef);

        if (aboutUsResult.exists()) {
          const aboutUsData: AboutUs = aboutUsResult.data();
          dispatch(setAboutUsText(aboutUsData));
        }
        setIsLoading(false);
      } catch (err) {
        console.log("Error getting document:", err);
      }
    };

    fetchAboutUsData();
  }, []);
  return {
    isLoading,
  };
};

export default useAboutUs;
