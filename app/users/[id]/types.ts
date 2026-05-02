

export interface Holding {
    quantity: number,
    currentPrice: number,
    avgBuyPrice: number,
    id: string,
    color: string,
    symbol: string,
    name: string,
    allocation: number,
}

export interface PortfolioSnapshotWithoutDecimal {
    id: string,
    portfolioId: string,
    timestamp: Date,
    value: number,
}

export interface Stats {
    dayChange: number,
    cashBalance: number,
    totalInvested: number,
    pnlPct: number,
    netWorth: number
    dayChangePct: number,
    snapshots: PortfolioSnapshotWithoutDecimal[],
}

export interface Achievement {
    id: string,
    label: string,
    icon: string,
    unlocked: boolean,
    desc: string,
    progress: number
}

export interface UserSettingForm {
    username: string;
    displayName: string;
    email: string;
    bio: string;
    location: string;
    avatar: File;
}
