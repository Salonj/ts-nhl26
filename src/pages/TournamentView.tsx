import { useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../lib/firebase";
import useTournament from "../hooks/useTournament";
import { DraftPhase } from "../Components/DraftPhase";
import { TeamRegistration } from "../Components/TeamRegistration";

const TournamentView = () => {
  const { id } = useParams();
  const { tournament } = useTournament(id);
  const [activeTab, setActiveTab] = useState<"group" | "playoff" | "results">(
    "group"
  );

  if (!tournament)
    return (
      <div className="text-white text-center pt-20">Turnausta ei löytynyt</div>
    );
  const isOwner = auth.currentUser?.uid == tournament?.ownerId;

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-white/15 ${
        tournament.status === "ongoing"
          ? "bg-green-500/15 text-green-200"
          : tournament.status === "draft"
          ? "bg-amber-400/15 text-amber-200"
          : "bg-slate-400/20 text-slate-100"
      }`}
    >
      {tournament.status === "ongoing"
        ? "Käynnissä"
        : tournament.status === "draft"
        ? "Avoin"
        : "Päättynyt"}
    </span>
  );

  if (tournament.status === "draft") {
    return (
      <div className="bg-black relative w-full min-h-screen overflow-hidden text-white pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-ts-red/20 blur-[120px]" />
          <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
        </div>

        <div className="relative z-20 w-full">
          <div className="border-b border-white/10 bg-black/30">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-2">
                      {tournament.name}
                    </h1>
                    <p className="text-white/70">
                      Joukkueita {tournament.teams.length}/
                      {tournament.settings.teamCount} • Lohkot{" "}
                      {tournament.settings.groupCount}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{statusBadge}</div>
                </div>

                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-linear-to-r from-ts-red to-ts-red/80 transition-all duration-300"
                    style={{
                      width: `${
                        (tournament.teams.length /
                          tournament.settings.teamCount) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-12">
            {tournament.teams.length < tournament.settings.teamCount ? (
              <TeamRegistration tournament={tournament} isOwner={isOwner} />
            ) : (
              <DraftPhase tournament={tournament} />
            )}

            {isOwner &&
              tournament.teams.length === tournament.settings.teamCount && (
                <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
                  <h3 className="text-xl font-semibold mb-4">Hallinta</h3>
                  <p className="text-white/60">Hallintapaneeli</p>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black relative w-full min-h-screen overflow-hidden text-white pt-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 top-10 h-80 w-80 rounded-full bg-ts-red/20 blur-[120px]" />
        <div className="absolute right-0 bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="relative z-20 border-b border-white/10 backdrop-blur-sm bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-white/70">
                Joukkueita {tournament.teams.length}/
                {tournament.settings.teamCount} • Lohkot{" "}
                {tournament.settings.groupCount}
              </p>
            </div>
            <div className="flex-shrink-0">{statusBadge}</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <p className="text-white/70 text-center">Turnaus on käynnissä</p>
      </div>
    </div>
  );
};

export default TournamentView;
