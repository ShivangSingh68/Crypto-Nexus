
import { Portfolio, Trade, User } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export function firstProfit(trade: Trade, avgBuyPrice: Decimal) {

    return trade.tradeValue.greaterThan(avgBuyPrice.mul(trade.coinCount));

}

export function tenTrades(trades: Trade[]): boolean {

    return trades.length >= 10

}

export function doublePortfolio(portfolio: Portfolio) {

    return portfolio.value.greaterThanOrEqualTo(20_000);

}

export function memeLord(trades: Trade[]) {

    let investmentInMeme = new Decimal(0);

    for(const trade of trades) {

        investmentInMeme = investmentInMeme.add(trade.tradeValue);

    }

    return investmentInMeme.greaterThanOrEqualTo(20_000);

}

export function aiVisionary(trades: Trade[]) {

    let investmentInAI = new Decimal(0);

    for(const trade of trades) {

        investmentInAI = investmentInAI.add(trade.tradeValue);

    }

    return investmentInAI.greaterThanOrEqualTo(20_000);

}

export function topTen(rank: number) {
    
    return rank <= 10 ;

}   

export function rankOne(user: User, richestUser: User): boolean {
    
    return user.id === richestUser.id;

}

export function millionare(portfolio: Portfolio): boolean {

    const totalPorfolioValue = portfolio.value;

    if(totalPorfolioValue.greaterThanOrEqualTo(1_000_000)) {
        return true;
    }

    return false;

}