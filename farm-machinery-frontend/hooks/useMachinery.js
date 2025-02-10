import { useState, useEffect } from "react";
import { db } from "../constants/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function useMachinery() {
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "machinery"),
      where("available", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMachinery(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { machinery, loading };
}
