
import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";
import { aiVisionary, doublePortfolio, firstProfit, memeLord, millionare, rankOne, tenTrades, topTen } from "./rewardAchievements";
import { getRichestUser, getUserRank } from "../leaderboard/leaderboard.service";
import { UserAchievement } from "@/lib/generated/prisma/client";

export async function updateAchievements (userId: string, event: "Price_Update" | "Trade", avgBuyPrice: Decimal = new Decimal(0)): Promise<Message<Decimal>> {
    try {
        
        const user = await db.user.findFirst({
            where: {
                id: userId,
            }
        });

        if(!user) {
            return {
                success: false,
                error: "Invalid user id"
            };
        }
        
        const userAchievements = await db.userAchievement.findMany({
            where: {
                userId: user.id
            },
            include: {
                achievement: true
            }
        });

        const allAchievements = await db.achievement.findMany();
        const achievementMap = new Map(allAchievements.map((a) => [a.type, a.id]));

        let hasFIRST_TRADE = false;
        let hasFIRST_PROFIT = false;
        let hasTEN_TRADES = false; 
        let hasDOUBLE_PORTFOLIO = false;
        let hasMEME_LORD = false;
        let hasAI_VISIONARY = false;
        let hasTOP_TEN = false; 
        let hasRANK_ONE = false;
        let hasMILLIONARE = false;

        for(const userAchievement of userAchievements) {

            const achievement = userAchievement.achievement;
            const type = achievement.type;

            if(type === "FIRST_TRADE") {
                hasFIRST_TRADE = true;
            }
            else if(type === "FIRST_PROFIT") {
                hasFIRST_PROFIT = true;
            }
            else if(type === "TEN_TRADES") {
                hasTEN_TRADES = true;
            }
            else if(type === "DOUBLE_PORTFOLIO") {
                hasDOUBLE_PORTFOLIO = true;
            }
            else if(type === "MEME_LORD") {
                hasMEME_LORD = true;
            }
            else if(type === "AI_VISIONARY") {
                hasAI_VISIONARY = true;
            }
            else if(type === "TOP_TEN") {
                hasTOP_TEN = true;
            }
            else if(type === "RANK_ONE") {
                hasRANK_ONE = true;
            }
            else if(type === "MILLIONARE") {
                hasMILLIONARE = true;
            }
        } 

        if(event === "Trade") {
            
            const trades = await db.trade.findMany({
                where: {
                    traderId: userId,
                },
                orderBy: {
                    timestamp: "desc",
                },
                include: {
                    coin: true
                }
            });

            if(!trades) {
                return {
                    success: false,
                    error: "No trade made by user",
                }
            };

            if(!hasFIRST_TRADE) {
                await db.userAchievement.create({
                    data: {
                        userId: user.id,
                        unlockedAt: new Date(Date.now()),
                        achievementId: achievementMap.get("FIRST_TRADE")!
                    }
                });
            }
            if(!hasFIRST_PROFIT) {
                if(trades[0].type === "SELL") {
                    const isTradeProfitable = firstProfit(trades[0], avgBuyPrice);
                    if(isTradeProfitable) {
                        await db.userAchievement.create({
                            data: {
                                userId: user.id,
                                unlockedAt: new Date(Date.now()),
                                achievementId: achievementMap.get("FIRST_PROFIT")!
                            }
                        })
                    }
                }
            }
            if(!hasTEN_TRADES) {
                const hasCompletedTEN_TRADES = tenTrades(trades);
                if(hasCompletedTEN_TRADES) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            unlockedAt: new Date(Date.now()),
                            achievementId: achievementMap.get("TEN_TRADES")!,
                        }
                    })
                }
            }
            if(!hasAI_VISIONARY) {
                const buyAITrades = trades.filter((trade) => trade.type === "BUY").filter((trade) => trade.coin.type === "AI");
                const isAIVisionary = aiVisionary(buyAITrades);  
                if(isAIVisionary) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("AI_VISIONARY")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }
            if(!hasMEME_LORD) {
                const buyMEMETrades = trades.filter((trade) => trade.type === "BUY").filter((trade) => trade.coin.type === "MEME");
                const isMemeLord = memeLord(buyMEMETrades);
                if(isMemeLord) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("MEME_LORD")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }

        } else {
            
            const portfolio = await db.portfolio.findFirst({
                where: {
                    userId: user.id,
                }
            });
            if(!portfolio) {
                return {
                    success: false,
                    error: "No portfolio found for user",
                }
            }

            if(!hasDOUBLE_PORTFOLIO) {
                const isDoublePortfolio = doublePortfolio(portfolio);
                if(isDoublePortfolio) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("DOUBLE_PORTFOLIO")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }
            if(!hasMILLIONARE) {
                const isMillionare = millionare(portfolio);
                if(isMillionare) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("MILLIONARE")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }
            if(!hasRANK_ONE) {
                const richestUser = (await getRichestUser()).data;
                const isRankOne = rankOne(user, richestUser!);
                if(isRankOne) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("RANK_ONE")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }
            if(!hasTOP_TEN) {
                const userRank = (await getUserRank(user.id)).data;
                const isTopTen = topTen(userRank!);
                if(isTopTen) {
                    await db.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievementMap.get("TOP_TEN")!,
                            unlockedAt: new Date(Date.now()),
                        }
                    })
                }
            }

        }

        return {
            success: true,
            msg: "Achievements updated successfully"
        }

    } catch (error) {
        
        console.error("Error: ", error);

        const errMsg = error instanceof Error ? error.message: "Internal error";

        return {
            success: false,
            error: errMsg,
        };
    }
}

export async function getUserAchievements (userId: string): Promise<Message<UserAchievement[]>> {
    try {
        
        const userAchievements = await db.userAchievement.findMany({
            where: {
                userId,
            },
            include: {
                achievement: true,
            }
        })

        return {
            success: true,
            data: userAchievements,
        }

    } catch (error) {
        
        console.error("Error: ", error);

        const errMsg = error instanceof Error? error.message : "Internal Error";

        return {
            success: false,
            error: errMsg,
        }
    }
}