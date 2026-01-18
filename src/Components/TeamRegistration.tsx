import { useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { type Team, type Tournament } from "../types";
import { db } from "../lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const TeamRegistration = ({
  tournament,
  isOwner,
}: {
  tournament: Tournament;
  isOwner: boolean;
}) => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1 || !p2 || loading) return;

    setLoading(true);
    try {
      const newTeam: Team = {
        id: crypto.randomUUID(),
        player1: p1,
        player2: p2,
      };

      const docRef = doc(db, "tournaments", tournament.id);
      await updateDoc(docRef, {
        teams: arrayUnion(newTeam),
      });

      setP1("");
      setP2("");
    } catch (error) {
      console.error("Error adding team:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex gap-6 flex-col lg:flex-row">
      {/* Teams List - Left Side */}
      <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Rekisteröidyt joukkueet
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ts-red">
              {tournament.teams.length}
            </span>
            <span className="text-white/60">
              / {tournament.settings.teamCount}
            </span>
          </div>
        </div>

        {tournament.teams.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/50 text-lg">Ei joukkueita vielä</p>
            <p className="text-white/40 text-sm mt-2">
              Omistaja voi lisätä joukkueita oikealla
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tournament.teams.map((team, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 bg-black/30 border border-white/10 rounded-lg hover:border-ts-red/50 hover:bg-black/40 transition-all"
              >
                <div className="flex-shrink-0 h-12 w-12 bg-linear-to-br rounded-3xl from-ts-red to-ts-red/60 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">
                    {team.player1} <span className="text-white/40">&</span>{" "}
                    {team.player2}
                  </p>
                  {team.nhlTeam ? (
                    <p className="text-xs text-green-400 font-medium mt-1">
                      {team.nhlTeam}
                    </p>
                  ) : (
                    <p className="text-xs text-white/40 mt-1">
                      Odottaa valintaa
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Team Form - Right Side */}
      {isOwner && (
        <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              Lisää joukkue
            </h2>
            <p className="text-white/70 text-sm">
              {tournament.settings.teamCount - tournament.teams.length} puuttuu
            </p>
          </div>

          <form onSubmit={handleAddTeam} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">
                Pelaaja 1
              </label>
              <input
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="esim. Marko"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all placeholder-gray-500 text-white hover:border-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-white/90">
                Pelaaja 2
              </label>
              <input
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="esim. Pekka"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all placeholder-gray-500 text-white hover:border-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !p1 || !p2}
              className="w-full py-3 bg-linear-to-r from-ts-red to-ts-red/80 hover:from-ts-red-dark hover:to-ts-red text-white font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-ts-red/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              {loading ? "Lisätään..." : "Lisää joukkue"}
            </button>

            <p className="text-xs text-white/50 text-center mt-6 pt-4 border-t border-white/10">
              Voit lisätä joukkueita kunnes kaikki paikat täyttyvät
            </p>
          </form>
        </div>
      )}
    </div>
  );
};
