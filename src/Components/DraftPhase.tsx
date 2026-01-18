import { useState } from "react";
import type { Tournament } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NHL_TEAMS } from "../data/nhlTeams";

interface DraftPhaseProps {
  tournament: Tournament;
  onTournamentUpdate?: () => void;
}

export const DraftPhase = ({ tournament }: DraftPhaseProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const currentPickIndex = tournament.teams.filter((t) => t.nhlTeam).length;
  const isDraftComplete = currentPickIndex >= tournament.teams.length;

  // If shuffle happened, we use the draftOrder array to know who's turn it is
  const currentTeamId = tournament.draftOrder
    ? tournament.draftOrder[currentPickIndex]
    : null;
  const currentTeamObj = tournament.teams.find((t) => t.id === currentTeamId);

  // 1. SHUFFLE LOGIC
  const handleStartDraft = async () => {
    // Create an array of Team IDs and shuffle them
    const teamIds = tournament.teams.map((t) => t.id);
    const shuffled = teamIds.sort(() => Math.random() - 0.5);

    await updateDoc(doc(db, "tournaments", tournament.id), {
      draftOrder: shuffled,
    });
  };

  // 2. SELECT TEAM (highlight only, no confirmation yet)
  const handleSelectTeam = (nhlTeamName: string) => {
    setSelectedTeam(nhlTeamName);
  };

  // 3. CONFIRM PICK
  const handleConfirmPick = async () => {
    if (!currentTeamObj || !selectedTeam) return;

    const updatedTeams = tournament.teams.map((t) => {
      if (t.id === currentTeamId) {
        return { ...t, nhlTeam: selectedTeam };
      }
      return t;
    });

    await updateDoc(doc(db, "tournaments", tournament.id), {
      teams: updatedTeams,
    });

    setSelectedTeam(null);

    // If this was the last pick, change status to 'ongoing'
    if (currentPickIndex + 1 === tournament.teams.length) {
      await updateDoc(doc(db, "tournaments", tournament.id), {
        status: "ongoing",
      });
    }
  };

  // 4. CANCEL SELECTION
  const handleCancelSelection = () => {
    setSelectedTeam(null);
  };

  // --- RENDER ---

  // State A: Teams are full, but Draft hasn't started (No Shuffle yet)
  if (!tournament.draftOrder) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-12 text-center">
          <div className="mb-6">
            <div className="text-5xl mb-4">🏒</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Joukkueet valmiina!
            </h2>
            <p className="text-white/70 text-lg mb-2">
              Arvo valinta järjestys aloittaaksesi varaustilaisuuden
            </p>
            <p className="text-white/50 text-sm">
              {tournament.teams.length} joukkuetta odottaa NHL-joukkuetta
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={handleStartDraft}
              className="inline-block py-4 px-12 bg-linear-to-r from-ts-red to-ts-red/80 hover:from-ts-red-dark hover:to-ts-red text-white font-bold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-ts-red/30 text-lg"
            >
              Arvo järjestys ja Aloita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State B: Draft is actively running
  return (
    <div className="w-full space-y-6">
      {/* Current Pick Status - Prominent Card */}
      <div className="bg-linear-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10">
        {!isDraftComplete ? (
          <div className="text-center">
            <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-3">
              ⏳ Vuorossa
            </p>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-ts-red to-indigo-400 mb-3">
              {currentTeamObj?.player1} & {currentTeamObj?.player2}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/60 mb-6">
              <div className="h-1 w-12 bg-linear-to-r from-ts-red/50 to-transparent rounded"></div>
              <span className="text-sm">Valitse joukkue alla</span>
              <div className="h-1 w-12 bg-linear-to-l from-ts-red/50 to-transparent rounded"></div>
            </div>
            {currentPickIndex > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Valintoja jäljellä:{" "}
                  <span className="text-white font-semibold">
                    {tournament.teams.length - currentPickIndex}
                  </span>
                </p>
              </div>
            )}

            {selectedTeam && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <img
                    src={NHL_TEAMS.find((t) => t.name === selectedTeam)?.logo}
                    alt={selectedTeam}
                    className="h-20"
                  />
                  <p className="text-white font-bold text-lg">{selectedTeam}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleConfirmPick}
                    className="flex-1 py-4 px-6 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Vahvista valinta
                  </button>
                  <button
                    onClick={handleCancelSelection}
                    className="flex-1 py-4 px-6 bg-red-600/50 hover:bg-red-600 text-white font-semibold rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Peruuta valinta
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-5xl mb-3">✓</p>
            <p className="text-3xl font-bold text-green-400 mb-3">
              Varaustilaisuus päättynyt!
            </p>
            <p className="text-white/60">
              Kaikki joukkueet on valinnut NHL-joukkueensa
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NHL Teams Grid - Main */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">NHL-joukkueet</h3>
          <div className="grid grid-cols-5 gap-4">
            {NHL_TEAMS.map((nhlTeam) => {
              const takenBy = tournament.teams.find(
                (t) => t.nhlTeam === nhlTeam.name
              );
              const isTaken = !!takenBy;
              const isCurrentTeamButton = !isDraftComplete && !isTaken;

              return (
                <button
                  key={nhlTeam.name}
                  disabled={isTaken || isDraftComplete}
                  onClick={() => handleSelectTeam(nhlTeam.name)}
                  className={`
                    relative group rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-4 aspect-square font-semibold text-center
                    ${
                      isTaken
                        ? "bg-black/40 border-white/5 opacity-40 cursor-not-allowed"
                        : selectedTeam === nhlTeam.name
                        ? "bg-linear-to-br from-green-500/30 to-green-500/10 border-green-500 ring-2 ring-green-500/50 cursor-pointer scale-105 shadow-lg shadow-green-500/20"
                        : isCurrentTeamButton
                        ? "bg-linear-to-br from-ts-red/20 to-ts-red/5 border-ts-red/50 hover:border-ts-red hover:from-ts-red/30 hover:to-ts-red/10 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-ts-red/20 active:scale-95"
                        : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 cursor-pointer hover:scale-105"
                    }
                  `}
                >
                  {isTaken ? (
                    <div className="text-center">
                      <img
                        src={nhlTeam.logo}
                        alt={nhlTeam.name}
                        className="h-6 mx-auto mb-1 opacity-30"
                      />
                      <p className="text-white/30 text-sm font-medium">
                        {takenBy.player1} & {takenBy.player2}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={nhlTeam.logo}
                        alt={nhlTeam.name}
                        className="w-full mx-auto  group-hover:scale-110 transition-transform"
                      />
                      <p className="text-white text-xs font-semibold">
                        {nhlTeam.name}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Draft Order - Sidebar */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">
            Varausjärjestys
          </h3>
          <div className="space-y-3  overflow-y-auto">
            {tournament.draftOrder?.map((teamId: string, index: number) => {
              const team = tournament.teams.find((t) => t.id === teamId);
              const isCurrent = teamId === currentTeamId && !isDraftComplete;
              const isDone = team?.nhlTeam ? true : false;
              const nhlTeamInfo = isDone
                ? NHL_TEAMS.find((t) => t.name === team?.nhlTeam)
                : null;

              return (
                <div
                  key={teamId}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all
                    ${
                      isCurrent
                        ? "bg-linear-to-r from-ts-red/30 to-ts-red/10 border-ts-red/50 text-white animate-pulse ring-2 ring-ts-red/30"
                        : isDone
                        ? "bg-green-500/10 border-green-500/30 text-white"
                        : "bg-black/30 border-white/10 text-white/60"
                    }
                  `}
                >
                  <span className="font-bold text-lg w-6 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="">
                    <p className="font-semibold text-sm">
                      {team?.player1} & {team?.player2}
                    </p>
                  </div>
                  {isDone && nhlTeamInfo ? (
                    <div className="flex items-center shrink-0">
                      <img
                        src={nhlTeamInfo.logo}
                        alt={nhlTeamInfo.name}
                        className="w-12 object-contain"
                      />
                      <span className="text-xs font-semibold text-green-200">
                        {nhlTeamInfo.name}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
