import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Tournament } from "../types";

const useTournament = (tournamentId: string | undefined) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    if (!tournamentId) {
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        doc(db, "tournaments", tournamentId),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setTournament({
              id: docSnapshot.id,
              ...docSnapshot.data(),
            } as Tournament);
          } else {
            setTournament(null);
          }
        },
        (err) => {
          console.error("Error fetching tournament:", err);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up tournament listener:", err);
    }
  }, [tournamentId]);

  return { tournament };
};

export default useTournament;
