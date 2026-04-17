
import { GAME } from "@/config/game";
import { Decimal } from "@prisma/client/runtime/library";

function getFeeRate(coinType: "GAME" | "AI" | "MEME") {
    if(coinType === "MEME") {
        return new Decimal(0.003);
    } if(coinType === "AI") {
        return new Decimal(0.002);
    } else {
        return new Decimal(0.001);
    }
}

// calculateFee(amount)
export function calculateTax(tradeAmt: Decimal, coinType: "GAME" | "AI" | "MEME") {
    const minFee = new Decimal(GAME.MIN_FEE);
    const rate = getFeeRate(coinType);

    const fee = tradeAmt.mul(rate);

    if(fee.lessThan(minFee)) {
        return minFee;
    } else {
        return fee;
    }
}