
import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";
import { aiVisionary, doublePortfolio, firstProfit, memeLord, millionare, rankOne, tenTrades, topTen } from "./rewardAchievements";
import { getRichestUser, getUserRank } from "../leaderboard/leaderboard.service";
import { AchievementType } from "@/lib/generated/prisma/client";
import { UserAchievementModified } from "../portfolio/portfolio.types";

const allAchievements = await db.achievement.findMany({
    include: {
        badge: true,
    }
});

const achievementMap = new Map(allAchievements.map((a) => [a.type, a]));

const getAchievementId = (type: AchievementType): string => {
    const achievement = achievementMap.get(type);
    if (achievement) throw new Error(`Achievement "${type}" not found in DB. Run prisma db seed.`);
    return achievement.id;
};

export async function updateAchievements(userId: string, event: "Price_Update" | "Trade", avgBuyPrice: Decimal = new Decimal(0)): Promise<Message<AchievementType[]>> {
    try {
        const user = await db.user.findFirst({ where: { id: userId } });
        if (!user) return { success: false, error: "Invalid user id" };

        const newAchievements: AchievementType[] = [];


        const userAchievements = await db.userAchievement.findMany({
            where: { userId: user.id },
            include: { achievement: true },
        });

        const unlockedTypes = new Set(userAchievements.map((ua) => ua.achievement.type));

        const has = (type: AchievementType) => unlockedTypes.has(type);

        const unlock = async (type: AchievementType) => {
            await db.userAchievement.create({
                data: {
                    userId: user.id,
                    achievementId: getAchievementId(type),
                    unlockedAt: new Date(),
                },
            });
            newAchievements.push(type);
        };

        if (event === "Trade") {
            const trades = await db.trade.findMany({
                where: { traderId: userId },
                orderBy: { timestamp: "desc" },
                include: { coin: true },
            });

            if (!trades.length) return { success: false, error: "No trades found for user" };

            if (!has(AchievementType.FIRST_TRADE)) {
                await unlock(AchievementType.FIRST_TRADE);
            }

            if (!has(AchievementType.FIRST_PROFIT) && trades[0].type === "SELL") {
                if (firstProfit(trades[0], avgBuyPrice).unlocked) {
                    await unlock(AchievementType.FIRST_PROFIT);
                }
            }

            if (!has(AchievementType.TEN_TRADES)) {
                if (tenTrades(trades).unlocked) {
                    await unlock(AchievementType.TEN_TRADES); // ← was wrongly FIRST_PROFIT
                }
            }

            if (!has(AchievementType.AI_VISIONARY)) {
                const buyAITrades = trades.filter((t) => t.type === "BUY" && t.coin.type === "AI");
                if (aiVisionary(buyAITrades).unlocked) {
                    await unlock(AchievementType.AI_VISIONARY);
                }
            }

            if (!has(AchievementType.MEME_LORD)) {
                const buyMemeTrades = trades.filter((t) => t.type === "BUY" && t.coin.type === "MEME");
                if (memeLord(buyMemeTrades).unlocked) {
                    await unlock(AchievementType.MEME_LORD);
                }
            }

        } else {
            const portfolio = await db.portfolio.findFirst({ where: { userId: user.id } });
            if (!portfolio) return { success: false, error: "No portfolio found for user" };

            if (!has(AchievementType.DOUBLE_PORTFOLIO) && doublePortfolio(portfolio).unlocked) {
                await unlock(AchievementType.DOUBLE_PORTFOLIO);
            }

            if (!has(AchievementType.MILLIONAIRE) && millionare(portfolio).unlocked) {
                await unlock(AchievementType.MILLIONAIRE);
            }

            if (!has(AchievementType.RANK_ONE)) {
                const richestUser = (await getRichestUser()).data;
                if (richestUser && rankOne(user, richestUser).unlocked) {
                    await unlock(AchievementType.RANK_ONE);
                }
            }

            if (!has(AchievementType.TOP_TEN)) {
                const userRank = (await getUserRank(user.id)).data;
                if (userRank !== undefined && topTen(userRank).unlocked) {
                    await unlock(AchievementType.TOP_TEN);
                }
            }
        }

        return { success: true, msg: "Achievements updated successfully", data: newAchievements };

    } catch (error) {
        console.error("Error in updateAchievements:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Internal error",
        };
    }
}

export async function getUserAchievements (userId: string): Promise<Message<UserAchievementModified[]>> {
    try {

        const [userTrades, userAchievements, userPortfolio] = await Promise.all([
            db.trade.findMany({
                where: {
                    traderId: userId
                },
                include: {
                    coin: {
                        select: {
                            type: true,
                        }
                    }
                }
            }),
            db.userAchievement.findMany({
                where: {
                    userId,
                },
                include: {
                    achievement: {
                        include: {
                            badge: true,
                        }
                    }
                }
            }),
            db.portfolio.findUnique({
                where: {
                    userId,
                }
            })
        ]);

        const  userAchievementMap = new Map(userAchievements.map((uc) => [uc.achievement.type, uc]));

        const processedAchievements: UserAchievementModified[] = [];
        
        for(const ac of allAchievements) {
            if(ac.type === "AI_VISIONARY") {

                const isAchieved = userAchievementMap.has(ac.type);

                const aiTrades = userTrades.filter( ut => ut.coin.type === "AI");

                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: !isAchieved ? aiVisionary(aiTrades).progress*100 : 0,
                })

            } else if(ac.type === "DOUBLE_PORTFOLIO") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: !isAchieved ? doublePortfolio(userPortfolio).progress*100 : 0,
                })

            } else if(ac.type === "FIRST_PROFIT") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: 0,
                })

            } else if(ac.type === "FIRST_TRADE") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: 0,
                })

            } else if(ac.type === "MEME_LORD") {

                const isAchieved = userAchievementMap.has(ac.type);
                const memeTrades = userTrades.filter( ut => ut.coin.type === "MEME")
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: !isAchieved ? memeLord(memeTrades).progress*100 : 0,
                })

            } else if(ac.type === "MILLIONAIRE") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: !isAchieved ? millionare(userPortfolio).progress*100 : 0,
                })

            } else if(ac.type === "RANK_ONE") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: 0,
                })

            } else if(ac.type === "TEN_TRADES") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: !isAchieved ? (tenTrades(userTrades).progress*100) : 0,
                })

            } else if(ac.type === "TOP_TEN") {

                const isAchieved = userAchievementMap.has(ac.type);
                processedAchievements.push({
                    achievement: ac,
                    id: ac.id,
                    unlocked: isAchieved,
                    progress: 0,
                })

            }
        }
        return {
            success: true,
            data: processedAchievements,
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