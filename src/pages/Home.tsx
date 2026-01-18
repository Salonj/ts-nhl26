import { useState, useEffect } from "react";
import { type Tournament } from "../types";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import TournamentCard from "../Components/TournamentCard";

const Home = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "tournaments"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tournament[];

      setTournaments(data);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="bg-black relative w-full h-screen overflow-hidden flex items-center justify-center text-white">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-ts-red/20 blur-[120px]" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 w-full px-20">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-white/70 tracking-widest text-sm">TULOSPALVELU</p>
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Aktiiviset turnaukset
          </h1>
          <p className="text-white/70">
            Seuraa käynnissä olevia tai käynnistä uusia turnauksia.
          </p>
          {tournaments.length === 0 ? (
            <p className="text-white/70 mt-4">Ei aktiivisia turnauksia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
