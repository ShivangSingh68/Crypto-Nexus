
import { Portfolio, Trade, User } from "@/lib/generated/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { AchievementMessage } from "./achievements.types";

export function firstProfit(trade: Trade, avgBuyPrice: Decimal): AchievementMessage {

    return {
        unlocked: trade.tradeValue.greaterThan(avgBuyPrice.mul(trade.coinCount)),
    };

}

export function tenTrades(trades: Trade[]): AchievementMessage {

    return {
        unlocked: trades.length >= 10,
        progress: (trades.length/10),
    }
}

export function doublePortfolio(portfolio: Portfolio): AchievementMessage {

    return {
        unlocked: portfolio.value.greaterThanOrEqualTo(50_000),
        progress: portfolio.value.toNumber()/50_000,
    }

}

export function memeLord(trades: Trade[]): AchievementMessage {

    let investmentInMeme = new Decimal(0);

    for(const trade of trades) {

        investmentInMeme = investmentInMeme.add(trade.tradeValue);

    }

    return {
        unlocked: investmentInMeme.greaterThanOrEqualTo(50_000),
        progress: investmentInMeme.toNumber()/50_000,
    }

}

export function aiVisionary(trades: Trade[]): AchievementMessage {

    let investmentInAI = new Decimal(0);

    for(const trade of trades) {

        investmentInAI = investmentInAI.add(trade.tradeValue);

    }

    return {
        unlocked: investmentInAI.greaterThanOrEqualTo(50_000),
        progress: investmentInAI.toNumber()/50_000,
    }

}

export function topTen(rank: number): AchievementMessage {
    
    return {
        unlocked: rank <= 10,
        progress: 0,
    }

}   

export function rankOne(user: User, richestUser: User): AchievementMessage {
    
    return {
        unlocked: user.id === richestUser.id,
        progress: 0,
    };

}

export function millionare(portfolio: Portfolio): AchievementMessage {

    const totalPorfolioValue = portfolio.value;

    return {
        unlocked: totalPorfolioValue.greaterThanOrEqualTo(1_000_000),
        progress: totalPorfolioValue.toNumber()/1_000_000,
    };

}