
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";
import { calculateTax } from "./fees";

interface BUYDATA {
    tax: Decimal,
    buyPrice: Decimal,
}

interface SELLDATA {
    tax: Decimal, 
    sellPrice: Decimal,
}


export function validateBuy(quantity: Decimal, cash: Decimal, coinCurrentPrice: Decimal, coinType: "AI" | "GAME" | "MEME"): Message<BUYDATA> {
    const totalBuyPrice = coinCurrentPrice.mul(quantity);

    const fee = calculateTax(totalBuyPrice, coinType);
    if(totalBuyPrice.add(fee).greaterThan(cash)) {
        return {
            success: false,
            error: "Not enough funds"
        }
    }
    return {
        success: true,
        data: {
            buyPrice: totalBuyPrice,
            tax: fee,
        }
    }
}

export function validateSell(qty: Decimal, holdingQty: Decimal, coinCurrentPrice: Decimal, coinType: "AI" | "GAME" | "MEME"): Message<SELLDATA> {
    if(qty.greaterThan(holdingQty)) {
        return {
            success: false,
            error: "Not enough coins to trade"
        }
    }
    const sellPrice = coinCurrentPrice.mul(qty);
    const fee = calculateTax(sellPrice, coinType);

    return {
        success: true,
        data: {
            sellPrice: sellPrice,
            tax: fee,
        }
    }
}