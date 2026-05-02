"use server";

import { getRankedPortfolios, getTopGainers24h, getTopLosers24h, getUserRank } from "@/modules/leaderboard/leaderboard.service";
import { LeaderboardEntry, Mover, UserStanding } from "./types";
import { getCurrentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";
import { calculateDayChange } from "@/modules/leaderboard/leaderboard.calc";

export async function getPortfolioLeaderboard (): Promise<LeaderboardEntry[]> {
    try {
        const response = await getRankedPortfolios();

        const processedResponse: LeaderboardEntry[] = response.map((r, idx) => ({
            ...r,
            rank: idx+1,
            dayChange: r.dayChange.toNumber(),
            dayChangePct: r.dayChangePct.toNumber(),
            netWorth: r.netWorth.toNumber(),
        }))
        
        return processedResponse;
    } catch (error) {   
        const errMsg = error instanceof Error ? error.message : "Internal error";     
        throw new Error(errMsg);
    }
}

export async function getDailyMovers(mode: "GAINERS" | "LOSERS"): Promise<Mover[]> {
    try {
        const movers = mode === "GAINERS" ? await getTopGainers24h() : await getTopLosers24h();

        return movers.data!;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Internal Error");
    }
}

export async function getUserStanding (mode: "Portfolio" | "Mover"): Promise<UserStanding> {
    try {
        const currentUser = await getCurrentUser();
        const [userRank, userCount, userPortfolio] = await Promise.all([getUserRank(currentUser.id, mode), db.user.findMany(), db.portfolio.findFirst({
            where: {
                userId: currentUser.id,
            },
            include: {
                snapshots: {
                    orderBy: {
                        timestamp: "asc"
                    }
                }
            }
        })]);
        const {dayChangePct} = calculateDayChange(userPortfolio.snapshots);
        return{
            rank: userRank.data ?? 0,
            netWorth: userPortfolio.value.toNumber(),
            total: userCount.length,
            dayChangePct: dayChangePct.toNumber(),
        }
    } catch (error) {
        throw error;
    }
}