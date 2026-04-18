
import { Decimal } from "@prisma/client/runtime/library";

export interface HoldingView {
    coinId: string,
    quantity: Decimal,
    avgBuyPrice: Decimal,
    currentPrice: Decimal,
    value: Decimal,
    pnl: Decimal,
    allocationPct: Decimal
}

export interface PortfolioView {
    cash: Decimal,
    totalValue: Decimal,
    totalPnl: Decimal,
    holdings: HoldingView[],
}

export interface PortfolioSummary {
    totalValue: Decimal,
    totalPnL: Decimal,
    pnlPercentage: Decimal,
}

export interface PortfolioChartPoint {
    timestamp: Date,
    value: Decimal,
}

export type Range = 
    "1D" |
    "7D" |
    "30D"|
    "All"