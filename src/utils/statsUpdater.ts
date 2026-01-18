import type { Tournament, Team, Match } from "../types";

export const updateTournamentStats = (tournament: Tournament): Team[] => {
  const teamMap = new Map<string, Team>();

  tournament.teams.forEach((team) => {
    teamMap.set(team.id, {
      ...team,
      stats: {
        wins: 0,
        losses: 0,
        otLosses: 0,
        points: 0,
        goalsScored: 0,
        goalsConceded: 0,
      },
    });
  });

  tournament.matches.forEach((match) => {
    if (match.status !== "completed" || match.type !== "group") return;

    if (match.homeScore === null || match.awayScore === null) return;

    if (!match.homeTeamId || !match.awayTeamId) return;

    const homeTeam = teamMap.get(match.homeTeamId);
    const awayTeam = teamMap.get(match.awayTeamId);

    if (!homeTeam || !awayTeam || !homeTeam.stats || !awayTeam.stats) return;

    homeTeam.stats.goalsScored += match.homeScore;
    homeTeam.stats.goalsConceded += match.awayScore;

    awayTeam.stats.goalsScored += match.awayScore;
    awayTeam.stats.goalsConceded += match.homeScore;

    const isOvertime = match.overtime === true;

    if (match.homeScore > match.awayScore) {
      homeTeam.stats.wins += 1;
      homeTeam.stats.points += 2;

      if (isOvertime) {
        awayTeam.stats.otLosses += 1;
        awayTeam.stats.points += 1;
      } else {
        awayTeam.stats.losses += 1;
      }
    } else if (match.awayScore > match.homeScore) {
      awayTeam.stats.wins += 1;
      awayTeam.stats.points += 2;

      if (isOvertime) {
        homeTeam.stats.otLosses += 1;
        homeTeam.stats.points += 1;
      } else {
        homeTeam.stats.losses += 1;
      }
    }
  });

  return Array.from(teamMap.values());
};
