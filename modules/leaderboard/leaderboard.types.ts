//TODO:

import { User } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


interface Snapshot {
    value: Decimal,
}
export interface LatestPortfolioSnapshotView {
    id: string,
    value: Decimal,
    user: User,
    snapshots: Snapshot[]
}

export interface Gainers {
    rank: number, 
    user: User,
    performance: Decimal,
}

export interface LeaderBoardSummary {
  richestUser: User,
  richestValue: Decimal,
  topGainerUser: User,
  topGainerPercent: Decimal,
  topLoserUser: User,
  topLoserPercent: Decimal,
  totalPlayers: number,
  currentUserRank?: number,
  currentUserValue?: Decimal
}
