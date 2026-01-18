import { type Team } from "../types/index";

export const getStandings = (teams: Team[]) => {
  return [...teams].sort((a, b) => {
    const statsA = a.stats!;
    const statsB = b.stats!;

    // 1. Most Points
    if (statsA.points !== statsB.points) {
      return statsB.points - statsA.points;
    }

    // 2. Most Wins (Regulation + OT)
    if (statsA.wins !== statsB.wins) {
      return statsB.wins - statsA.wins;
    }

    // 3. Goal Difference
    const diffA = statsA.goalsScored - statsA.goalsConceded;
    const diffB = statsB.goalsScored - statsB.goalsConceded;
    return diffB - diffA;
  });
};
