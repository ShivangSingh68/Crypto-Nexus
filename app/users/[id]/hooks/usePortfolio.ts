"use client";

import { useEffect, useState } from "react";
import { Achievement, Holding, Stats } from "../types";
import { getAchievements, getHoldingData, getStats } from "../action";
import { getCurrentUser } from "@/modules/auth/actions";
import { User } from "@/lib/generated/prisma/client";

export function usePortfolio(userId: string) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [holdingsRes, statsRes, achievementRes, currUser] = await Promise.all([
          getHoldingData(userId),
          getStats(userId),
          getAchievements(userId),
          getCurrentUser(),
        ]);
        setHoldings(holdingsRes);
        setStats(statsRes);
        setAchievements(achievementRes);
        setUser(currUser);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  return { holdings, stats, achievements, user, loading };
}