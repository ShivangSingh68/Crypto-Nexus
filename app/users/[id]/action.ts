'use server'

import { getPortfolioSummary, getUserPortfolio } from "@/modules/portfolio/portfolio.service";
import { Achievement, Holding, Stats } from "./types";
import { getUserAchievements } from "@/modules/achievements/achievements.service";

export async function getHoldingData(userId: string): Promise<Holding[]> {
    try {
        
        const res = await getUserPortfolio(userId);
        
        const holdings = res.data.holdings;

        const processedHoldings: Holding[] = holdings.map((h) => {
            return {
                allocation: h.allocationPct.toNumber(),
                avgBuyPrice: h.avgBuyPrice.toNumber(),
                color: h.coin.color,
                currentPrice: h.coin.currentPrice.toNumber(),
                id: h.id,
                name: h.coin.name,
                quantity: h.quantity.toNumber(),
                symbol: h.coin.ticker,
            }
        });
        return processedHoldings;

    } catch (error) {
        
        console.error("Error fetching holdings data: ", error);
        
        return [];
    
    }
}

export async function getStats(userId: string): Promise<Stats> {
    try {
        
        const stats = await getPortfolioSummary(userId);

        if(!stats.success) {
            console.error(stats.error);
            return {} as Stats
        }

        const processedStats: Stats = {
            cashBalance: stats.data.cashBalance.toNumber(),
            dayChange: stats.data.dayChange.toNumber(),
            dayChangePct: stats.data.dayChangePct.toNumber(),
            netWorth: stats.data.totalValue.toNumber(),
            pnlPct: stats.data.pnlPercentage.toNumber(),
            totalInvested: stats.data.totalValue.sub(stats.data.cashBalance).toNumber(),
            snapshots: stats.data.snapshots,
        }; 

        return processedStats;

    } catch (error) {

        console.error("Error fetching stats: ", error);       
    
        return {} as Stats;
    }
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
    try {
        
        const achievements = await getUserAchievements(userId);

        if(!achievements.success) {
            return [];
        }

        const processedAchievements: Achievement[] = achievements.data.map((ac) => ({
            icon: ac.achievement.badge.image,
            desc: ac.achievement.description,
            id: ac.id,
            label: ac.achievement.name,
            progress: ac.progress,
            unlocked: ac.unlocked
        })
        ) ;

        return processedAchievements;

    } catch (error) {
        
        console.error("Failed to fetch user achievements: ", error);

        return [];

    }
}