
import { GAME } from "@/config/game";
import { Decimal } from "@prisma/client/runtime/library";

interface simulateWhaleActivityReturns {
    buyVolume: Decimal,
    sellVolume: Decimal,
}
export function simulateWhaleActivity(liquidity: Decimal):  simulateWhaleActivityReturns{
    const rand = Math.random();

    if(rand > GAME.WHALE_PROBABILITY) {
        return {
            buyVolume: new Decimal(0),
            sellVolume: new Decimal(0),
        }
    }
    const sizePercentage = (Math.random() * (GAME.WHALE_SIZE_MAX - GAME.WHALE_SIZE_MIN))/GAME.WHALE_SIZE_MAX;
    const volume = liquidity.mul(sizePercentage)
    const isBuy = Math.random() > 0.5;
    if(isBuy) {
        return {
            buyVolume: volume,
            sellVolume: new Decimal(0),
        }
    } else {
        return {
            buyVolume: new Decimal(0),
            sellVolume: volume,
        }
    }
}