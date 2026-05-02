import { Decimal } from "@prisma/client/runtime/library";


export interface HoldingWithCoinType {
    avgBuyPrice: Decimal,
    quantity: Decimal,
    coinType: string,
}

export interface AchievementMessage {
    unlocked: boolean,
    progress?: number,
}
