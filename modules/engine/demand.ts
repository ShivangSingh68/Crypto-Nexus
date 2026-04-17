
import { GAME } from "@/config/game"
import { Decimal } from "@prisma/client/runtime/library";
import { getLiquidityFactor } from "./liquidity-factor";

interface CalculateDemandImpactProps {
    buyVolume: Decimal,
    sellVolume: Decimal,
    liquidity: Decimal
    type: "AI" | "MEME" | "GAME"
}


export function calculateDemandImpact(params: CalculateDemandImpactProps): Decimal {
    const {buyVolume, sellVolume, liquidity, type} = params;

    if(liquidity.eq(0)) {
        return new Decimal(0)
    }
    const netDemand: Decimal = buyVolume.sub(sellVolume);
    const damping = new Decimal(GAME.DEMAND_DAMPING);
    const liquidityFactor = getLiquidityFactor(liquidity, type) as Decimal;
    const MAX_IMPACT = new Decimal(0.2);
    const MIN_IMPACT = new Decimal(-0.2);
    let demandImpact: Decimal = netDemand.div(liquidity).mul(liquidityFactor).mul(damping);
    if(demandImpact.greaterThan(MAX_IMPACT)) {
        demandImpact = MAX_IMPACT;
    }
    if(demandImpact.lessThan(MIN_IMPACT)) {
        demandImpact = MIN_IMPACT;
    }
    return demandImpact;
}