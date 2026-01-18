import type { FieldValue } from "firebase/firestore";

export interface Team {
  id: string;
  player1: string;
  player2: string;

  nhlTeam?: string;
  nhlTeamLogo?: string;

  groupId?: string;

  stats?: {
    wins: number;
    losses: number;
    otLosses: number;
    points: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

export interface Tournament {
  id: string;
  ownerId: string;
  name: string;
  createdAt: Date | FieldValue;
  settings: {
    teamCount: number;
    groupCount: number;
  };
  status: "draft" | "ongoing" | "finished";
  teams: Team[];
  matches: Match[];
  draftOrder?: string[];
}

export interface Match {
  id: string;
  tournamentId: string;

  homeTeamId: string | null;
  awayTeamId: string | null;

  homeScore: number | null;
  awayScore: number | null;

  overtime?: boolean;

  status: "scheduled" | "live" | "completed";
  type: "group" | "quarterfinal" | "semifinal" | "final";

  groupId?: string;

  nextMatchId?: string;
  round?: number;
  matchIndex?: number;
}
