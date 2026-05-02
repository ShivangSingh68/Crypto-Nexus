
import { PortfolioSnapshotWithoutDecimal } from "@/app/users/[id]/types";
import { AchievementType, Badge, Coin } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface HoldingView {
    id: string,
    quantity: Decimal,
    avgBuyPrice: Decimal,
    value: Decimal,
    pnl: Decimal,
    allocationPct: Decimal
    coin: Coin
}

export interface PortfolioView {
    cash: Decimal,
    totalValue: Decimal,
    totalPnl: Decimal,
    holdings: HoldingView[],
}

export interface PortfolioSummary {
    dayChange: Decimal,
    cashBalance: Decimal,
    dayChangePct: Decimal,
    totalValue: Decimal,
    totalPnL: Decimal,
    pnlPercentage: Decimal,
    snapshots: PortfolioSnapshotWithoutDecimal[],
}

export interface PortfolioChartPoint {
    timestamp: Date,
    value: Decimal,
}

export interface UserAchievementModified {
    achievement: {
        badge: Badge,
        name: string;
        id: string;
        description: string;
        type: AchievementType;
    },
    unlocked: boolean,
    progress?: number,
    id: string
}

export type Range = 
    "1D" |
    "7D" |
    "30D"|
    "All"