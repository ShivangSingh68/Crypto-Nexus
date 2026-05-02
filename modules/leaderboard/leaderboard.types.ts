import { User } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface LatestPortfolioSnapshotView {
  avatar: string;
  badge: string[];
  dayChange: Decimal;
  netWorth: Decimal;
  totalTrades: number;
  winRate: Decimal;
  userId: string;
  username: string;
  dayChangePct: Decimal;
  rank: number;
}

export interface Gainers {
    userId: string,
    dayChange: number,
    avatar: string,
    username: string,
    rank: number,
    dayChangePct: number,
}

export interface LeaderBoardSummary {
  richestUserId: string;
  richestValue: Decimal;
  topGainerUser: User;
  topGainerPercent: Decimal;
  topLoserUser: User;
  topLoserPercent: Decimal;
  totalPlayers: number;
  currentUserRank?: number;
  currentUserValue?: Decimal;
}
