import { useNavigate } from "react-router-dom";
import { type Tournament } from "../types";

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/tournament/${tournament.id}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "ongoing":
        return "bg-green-500/20 text-green-400";
      case "finished":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Luonnosversio";
      case "ongoing":
        return "Käynnissä";
      case "finished":
        return "Päättynyt";
      default:
        return status;
    }
  };

  return (
    <div
      onClick={handleViewDetails}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white group-hover:text-ts-red transition-colors">
            {tournament.name}
          </h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(tournament.status)}`}
        >
          {getStatusLabel(tournament.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide">
            Joukkueet
          </p>
          <p className="text-2xl font-bold text-white">
            {tournament.teams?.length || 0}
          </p>
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide">
            Ottelut
          </p>
          <p className="text-2xl font-bold text-white">
            {tournament.matches?.length || 0}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-sm text-white/50 mt-1">
          ID:{tournament.id.substring(0, 10)}...
        </p>
        <button
          className="px-4 py-2 bg-ts-red/80 hover:bg-ts-red text-white rounded-md text-sm font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          Näytä tiedot
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
