import { useNavigate } from "react-router-dom";
import type { Tournament, Match, Team } from "../types";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

const CreateTournament = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [teamCount, setTeamCount] = useState(8);
  const [groupCount, setGroupCount] = useState(2);

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("current user:", auth.currentUser);

    if (!auth.currentUser) return;

    try {
      const newTournament: Omit<Tournament, "id"> = {
        name,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        settings: {
          teamCount,
          groupCount,
        },
        status: "draft",
        teams: [],
        matches: [],
      };

      const docRef = await addDoc(collection(db, "tournaments"), newTournament);
      navigate(`/tournament/${docRef.id}`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-black relative w-full h-screen overflow-hidden flex items-center justify-center text-white">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-ts-red/20 blur-[120px]" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-20">
        <div className="w-full rounded-2xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <header className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-white/60">
              Uusi turnaus
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Luo turnaus</h1>
            <p className="mt-2 text-white/70">
              Määritä turnauksen asetukset ja aloita
            </p>
          </header>

          <form onSubmit={handleCreateTournament} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Turnauksen nimi
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Esim. Pihapelit 2026"
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Joukkueiden määrä:{" "}
                <span className="text-ts-red font-bold">{teamCount}</span>
              </label>
              <input
                type="range"
                min="4"
                max="16"
                value={teamCount}
                onChange={(e) => setTeamCount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-ts-red"
              />
              <div className="flex justify-between text-xs text-white font-bold mt-1">
                <span>4</span>
                <span>16</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Lohkojen määrä
              </label>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all text-white cursor-pointer"
              >
                <option value={1} className="bg-slate-900">
                  1 Lohko (Sarja)
                </option>
                <option value={2} className="bg-slate-900">
                  2 Lohkoa
                </option>
                <option value={4} className="bg-slate-900">
                  4 Lohkoa
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-ts-red hover:bg-ts-red/80 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 px-4 py-3"
            >
              Luo turnaus
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTournament;
