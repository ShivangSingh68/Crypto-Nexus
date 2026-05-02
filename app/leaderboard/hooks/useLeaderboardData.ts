import { useEffect, useState } from "react"
import { LeaderboardEntry, Mover, UserStanding, ViewMode } from "../types";
import { getDailyMovers, getPortfolioLeaderboard, getUserStanding } from "../actions";
// import { getTopGainers24h } from "@/modules/leaderboard/leaderboard.service";

export function useLeaderBoardData(mode: ViewMode) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [entries, setEntries] = useState<LeaderboardEntry[] | Mover[]>([]);
    const [movers, setMovers] = useState<Mover[]>([]);
    const [userStanding, setUserStanding] = useState<UserStanding>({
        rank: 0,
        total: 0,
        netWorth: 0,
        dayChangePct: 0,
    });
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                if(mode === "portfolio") {
                    const [leaders, moversRes] = await Promise.all([
                        getPortfolioLeaderboard(),
                        getDailyMovers("GAINERS"),
                    ])
                    setEntries(leaders);
                    setMovers(moversRes ?? []);
                } else if(mode === "gainers") {
                    const gainers = await getDailyMovers("GAINERS");
                    setEntries(gainers ?? []);
                    setMovers([]);
                } else {
                    const losers = await getDailyMovers("LOSERS");
                    setEntries(losers ?? []);
                    setMovers([]);
                }

                const res = await getUserStanding(mode === "portfolio" ? "Portfolio" : "Mover");
                setUserStanding(res);
            } catch (error) {   
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    },[mode]);

    return {
        entries,
        movers,
        userStanding: userStanding,
        isLoading,
    }
}