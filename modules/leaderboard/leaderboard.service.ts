import { db } from "@/lib/db";
import { User } from "@/lib/generated/prisma/client";
import { Message } from "@/types/messages";
import { rankUsers } from "./leaderboard.calc";
import {
  Gainers,
  LatestPortfolioSnapshotView,
  LeaderBoardSummary,
} from "./leaderboard.types";
import { Decimal } from "@prisma/client/runtime/library";
import { getCurrentUser } from "../auth/actions";

async function getRankedByPerformance(
  order: "asc" | "desc",
): Promise<{ user: User; prcnt: Decimal }[]> {
  const portfolios = await db.portfolio.findMany({
    include: {
      user: true,
      snapshots: {
        orderBy: { timestamp: "asc" },
        select: { value: true, timestamp: true },
      },
    },
  });

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return portfolios
    .map((p) => {
      const snaps = p.snapshots;
      if (snaps.length === 0) return null;

      const latest = snaps[snaps.length - 1].value;
      const oldest = snaps.find((s) => new Date(s.timestamp) >= cutoff);
      const startVal = oldest ? oldest.value : snaps[0].value;

      if (startVal.eq(0)) return null;

      const prcnt = latest.sub(startVal).div(startVal);
      return { user: p.user, prcnt };
    })
    .filter((x): x is { user: User; prcnt: Decimal } => x !== null)
    .sort((a, b) =>
      order === "desc"
        ? b.prcnt.toNumber() - a.prcnt.toNumber()
        : a.prcnt.toNumber() - b.prcnt.toNumber(),
    )
    .slice(0, 10);
}

 export async function getRankedPortfolios(): Promise<LatestPortfolioSnapshotView[]> {
  const portfolios = await db.portfolio.findMany({
    include: {
      user: true,
      snapshots: {
        orderBy: { timestamp: "desc" },
        take: 1,
        select: { value: true },
      },
    },
  });
  return rankUsers(portfolios);
}



export async function getRichestUser(): Promise<Message<User>> {
  try {
    const ranked = await getRankedPortfolios();

    if (ranked.length === 0) {
      return { success: false, error: "No users found" };
    }

    return { success: true, data: ranked[0].user };
  } catch (error) {
    console.error("Error: ", error);
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return { success: false, error: errMsg };
  }
}

export async function getTopGainers24h(): Promise<Message<Gainers[]>> {
  try {
    const ranked = await getRankedByPerformance("desc");

    const returnData: Gainers[] = ranked.map((p, i) => ({
      rank: i + 1,
      performance: p.prcnt,
      user: p.user,
    }));

    return { success: true, data: returnData };
  } catch (error) {
    console.error("Error: ", error);
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return { success: false, error: errMsg };
  }
}

export async function getTopLosers24h(): Promise<Message<Gainers[]>> {
  try {
    const ranked = await getRankedByPerformance("asc");

    const returnData: Gainers[] = ranked.map((p, i) => ({
      rank: i + 1,
      performance: p.prcnt,
      user: p.user,
    }));

    return { success: true, data: returnData };
  } catch (error) {
    console.error("Error: ", error);
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return { success: false, error: errMsg };
  }
}

export async function getUserRank(userId: string): Promise<Message<number>> {
  try {
    const ranked = await getRankedPortfolios();

    const idx = ranked.findIndex((r) => r.user.id === userId);

    if (idx === -1) {
      return { success: false, error: "User not found in rankings" };
    }

    return { success: true, data: idx + 1 };
  } catch (error) {
    console.error("Error: ", error);
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return { success: false, error: errMsg };
  }
}

export async function getLeaderboardSummary(): Promise<
  Message<LeaderBoardSummary>
> {
  try {
    const [rankedByValue, gainers, losers, currentUser] = await Promise.all([
      getRankedPortfolios(),
      getRankedByPerformance("desc"),
      getRankedByPerformance("asc"),
      getCurrentUser(),
    ]);

    if (rankedByValue.length === 0 || gainers.length === 0) {
      return { success: false, error: "Not enough data for leaderboard" };
    }

    let currentUserRank: number | undefined;
    let currentUserValue: Decimal | undefined;

    if (currentUser) {
      const idx = rankedByValue.findIndex((r) => r.user.id === currentUser.id);
      if (idx !== -1) {
        currentUserRank = idx + 1;
        currentUserValue = rankedByValue[idx].snapshots[0]?.value;
      }
    }

    const returnData: LeaderBoardSummary = {
      richestUser: rankedByValue[0].user,
      richestValue: rankedByValue[0].snapshots[0].value,
      topGainerUser: gainers[0].user,
      topGainerPercent: gainers[0].prcnt,
      topLoserUser: losers[0].user,
      topLoserPercent: losers[0].prcnt,
      totalPlayers: rankedByValue.length,
      currentUserRank,
      currentUserValue,
    };

    return { success: true, data: returnData };
  } catch (error) {
    console.error("Error: ", error);
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return { success: false, error: errMsg };
  }
}