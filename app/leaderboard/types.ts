
export interface LeaderboardEntry {
    userId: string,
    rank: number,
    dayChange: number,
    badge: string[],
    avatar: string,
    username: string,
    netWorth: number,
    dayChangePct: number,
    totalTrades: number,
}

export interface Mover {
    userId: string,
    dayChange: number,
    avatar: string,
    username: string,
    rank: number,
    dayChangePct: number,
}

export type ViewMode = 'portfolio' | 'gainers' | 'losers';

export type UserStanding= {
    rank: number,
    total: number,
    netWorth: number,
    dayChangePct: number
}

