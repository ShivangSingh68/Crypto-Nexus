
import { GAME } from "@/config/game";
import { Decimal } from "@prisma/client/runtime/library";

export function calculateMomentum(previousPrices: Decimal[]): Decimal {
    const len = previousPrices.length;
    if(len < 6) {
        return new Decimal(0);
    }
    let recentPriceSum = new Decimal(0);
    let oldPriceSum = new Decimal(0);
    for(let i = len-1; i>=len-3; i--) {
        recentPriceSum = recentPriceSum.add(previousPrices[i]);
    }
    for(let i = len-4; i >=len-6; i--) {
        oldPriceSum = oldPriceSum.add(previousPrices[i]);
    }
    const recentAvg = recentPriceSum.div(new Decimal(3));
    const oldAvg = oldPriceSum.div(new Decimal(3));

    if(oldAvg.eq(0) || oldAvg.lessThanOrEqualTo(0.0001)) {
        return new Decimal(0);
    }
    const MAX = new Decimal(0.05);
    const MIN = new Decimal(-0.05);
    const damping = new Decimal(GAME.MOMENTUM_DAMPING);
    let momentum = recentAvg.sub(oldAvg).div(oldAvg).mul(damping);
    if(momentum.greaterThan(MAX)) {
        momentum = MAX;
    }
    if(momentum.lessThan(MIN)) {
        momentum = MIN;
    }

    return momentum;
}