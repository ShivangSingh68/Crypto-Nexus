
import { Message } from "@/types/messages";
import {
  HoldingView,
  PortfolioChartPoint,
  PortfolioSummary,
  PortfolioView,
  Range,
} from "./portfolio.types";
import { db } from "@/lib/db";

import {
  calculateAllocation,
  calculateDayChangeForPortfolio,
  calculateHoldingPnL,
  calculateHoldingValue,
  calculateTotalPnL,
  calculateTotalValue,
  HoldingData,
} from "./portfolio.calc";
import { Decimal } from "@prisma/client/runtime/library";
import { Holding, PortfolioSnapshot } from "@/lib/generated/prisma/client";
import { updateAchievements } from "../achievements/achievements.service";
import { PortfolioSnapshotWithoutDecimal } from "@/app/users/[id]/types";

//returns cash, totalValue, totalPnl, holdings[]
export async function getUserPortfolio(
  userId: string,
): Promise<Message<PortfolioView>> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No portfolio linked to user",
      };
    }

    const holdings: Holding[] =
      (await db.holding.findMany({
        where: {
          portfolioId: userPortfolio.id,
        },
      })) ?? ([] as Holding[]);
    const coinIds = holdings.map((hld) => hld.coinId);
    const coins = await db.coin.findMany({
      where: {
        id: {
          in: coinIds,
        },
      },
    });

    const coinMap = new Map(coins.map((c) => [c.id, c]));

    const holdingData: HoldingData[] = holdings
      .map((hld) => {
        const price = coinMap.get(hld.coinId).currentPrice;

        if (!price) {
          return null;
        }

        return {
          coinId: hld.coinId,
          avgBuyPrice: hld.avgBuyPrice,
          currentPrice: price,
          quantity: hld.quantity,
        };
      })
      .filter((hld) => hld !== null);

    const totalPortfolioValue = calculateTotalValue(
      holdingData,
      userPortfolio.cash,
    );

    const holdingView: HoldingView[] = holdings
      .map((hld) => {
        const coin = coinMap.get(hld.coinId);

        if (!coin) {
          return null;
        }
        return {
          id: hld.id,
          avgBuyPrice: hld.avgBuyPrice,
          allocationPct: calculateAllocation(
            hld.quantity,
            coin.currentPrice,
            totalPortfolioValue,
          ),
          pnl: calculateHoldingPnL({
            avgBuyPrice: hld.avgBuyPrice,
            coinId: hld.coinId,
            currentPrice: coin.currentPrice,
            quantity: hld.quantity,
          }),
          quantity: hld.quantity,
          value: calculateHoldingValue(hld.quantity, coin.currentPrice),
          coin,
        };
      })
      .filter((hld) => hld !== null);

    return {
      success: true,
      data: {
        cash: userPortfolio.cash,
        totalPnl: calculateTotalPnL(holdingData),
        holdings: holdingView,
        totalValue: totalPortfolioValue,
      },
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal Error";

    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function getPortfolioHoldingsDetailed(
  userId: string,
): Promise<Message<HoldingView[]>> {
  try {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No portfolio linked to user",
      };
    }

    const holdings: Holding[] = await db.holding.findMany({
      where: {
        portfolioId: userPortfolio.id,
      },
    });

    const coinIds = holdings.map((hld) => hld.coinId);

    const coins = await db.coin.findMany({
      where: {
        id: {
          in: coinIds,
        },
      },
    });

    const coinMap = new Map(coins.map((c) => [c.id, c]));

    const holdingData: HoldingData[] = holdings
      .map((hld) => {
        const coin = coinMap.get(hld.coinId);

        if (!coin) {
          return;
        }

        return {
          avgBuyPrice: hld.avgBuyPrice,
          coinId: hld.coinId,
          currentPrice: coin.currentPrice,
          quantity: hld.quantity,

        };
      })
      .filter((hld) => hld !== undefined);

    const totalPortfolioValue = calculateTotalValue(
      holdingData,
      userPortfolio.cash,
    );

    const processedHoldings: HoldingView[] = holdings
      .map((hld) => {
        const coin = coinMap.get(hld.coinId);

        if (!coin) {
          return;
        }

        return {
          id: hld.id,
          avgBuyPrice: hld.avgBuyPrice,
          value: calculateHoldingValue(hld.quantity, coin.currentPrice),
          pnl: calculateHoldingPnL({
            avgBuyPrice: hld.avgBuyPrice,
            coinId: hld.coinId,
            currentPrice: coin.currentPrice,
            quantity: hld.quantity,
          }),
          allocationPct: calculateAllocation(
            hld.quantity,
            coin.currentPrice,
            totalPortfolioValue,
          ),
          quantity: hld.quantity,
          coin,
        };
      })
      .filter((hld) => hld !== undefined);

    return {
      success: true,
      data: processedHoldings,
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal Error";

    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function getPortfolioChartData(
  userId: string,
): Promise<Message<PortfolioChartPoint[]>> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No portfolio linked to user",
      };
    }

    const userPortfolioSnapshot = await db.portfolioSnapshot.findMany({
      where: {
        portfolioId: userPortfolio.id,
      },
      select: {
        timestamp: true,
        value: true,
      },
    });

    return {
      success: true,
      data: userPortfolioSnapshot,
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal error";

    return {
      success: false,
      error: errMsg,
    };
  }
}

//return % change over time
export async function getPortfolioPerformance(
  userId: string,
  range: Range,
): Promise<Message<Decimal>> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No portfolio linked to user",
      };
    }

    const rangeMap = new Map<Range, number>([
      ["1D", 48],
      ["7D", 336],
      ["30D", 1440],
      ["All", Number.MAX_VALUE],
    ]);

    const portfolioSnapshots: PortfolioSnapshot[] =
      await db.portfolioSnapshot.findMany({
        where: {
          portfolioId: userPortfolio.id,
        },
        orderBy: {
          timestamp: "asc",
        },
      });

    const len = portfolioSnapshots.length;
    if (len === 0) {
      return { success: true, data: new Decimal(0) };
    }
    const i = rangeMap.get(range) ?? 0;
    const strIdx = len - 1 - i < 0 ? 0 : len - 1 - i;
    const strtVal = portfolioSnapshots[strIdx].value;
    const endVal = portfolioSnapshots[len - 1].value;

    let percentageChange = new Decimal(1);

    if (!strtVal.eq(0)) {
      percentageChange = endVal.sub(strtVal).div(strtVal);
    }

    return {
      success: true,
      data: percentageChange,
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal Error";

    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function getPortfolioSummary(
  userId: string,
): Promise<Message<PortfolioSummary>> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        snapshots: {
          orderBy: {
            timestamp: "asc"
          }
        },
      }
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No Portfolio linked to user",
      };
    }

    const holdings = await db.holding.findMany({
      where: {
        portfolioId: userPortfolio.id,
      },
    });

    const coinIds = holdings.map((hld) => hld.coinId);

    const coins = await db.coin.findMany({
      where: {
        id: { in: coinIds },
      },
    });

    const coinMap = new Map(coins.map((c) => [c.id, c.currentPrice]));

    const processedHoldings: HoldingData[] = holdings
      .map((hld) => {
        const price = coinMap.get(hld.coinId);
        if (!price) {
          return;
        }
        return {
          avgBuyPrice: hld.avgBuyPrice,
          coinId: hld.coinId,
          currentPrice: price,
          quantity: hld.quantity,
        };
      })
      .filter((hld) => hld !== undefined);

    const totalValue = calculateTotalValue(
      processedHoldings,
      userPortfolio.cash,
    );

    const totalPnL = calculateTotalPnL(processedHoldings);

    let pnlPercentage = new Decimal(0);

    if (!totalValue.eq(0)) {
      pnlPercentage = totalPnL.div(totalValue);
    }
    
    const {dayChange, dayChangePct} = calculateDayChangeForPortfolio(userPortfolio.snapshots);

    const snapshots: PortfolioSnapshotWithoutDecimal[] = userPortfolio.snapshots.map(snap => ({
      ...snap,
      value: snap.value.toNumber(),
    }));

    return {
      success: true,
      data: {
        cashBalance: userPortfolio.cash,
        dayChange,
        dayChangePct,
        totalPnL,
        pnlPercentage,
        totalValue,
        snapshots,
      },
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal error";

    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function createPortfolioSnapshot(
  userId: string,
  timestamp: Date,
): Promise<Message<Decimal>> {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid user id",
      };
    }

    const userPortfolio = await db.portfolio.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPortfolio) {
      return {
        success: false,
        error: "No Portfolio linked to user",
      };
    }

    const holdings = await db.holding.findMany({
      where: {
        portfolioId: userPortfolio.id,
      },
    });

    const coinIds = holdings.map((hld) => hld.coinId);

    const coins = await db.coin.findMany({
      where: {
        id: { in: coinIds },
      },
    });

    const coinMap = new Map(coins.map((c) => [c.id, c.currentPrice]));

    const processedHoldings: HoldingData[] = holdings
      .map((hld) => {
        const price = coinMap.get(hld.coinId);
        if (!price) {
          return;
        }
        return {
          avgBuyPrice: hld.avgBuyPrice,
          coinId: hld.coinId,
          currentPrice: price,
          quantity: hld.quantity,
        };
      })
      .filter((hld) => hld !== undefined);

    const totalValue = calculateTotalValue(
      processedHoldings,
      userPortfolio.cash,
    );

    const portfolioSnapshot: PortfolioSnapshot =
      await db.portfolioSnapshot.create({
        data: {
          portfolioId: userPortfolio.id,
          value: totalValue,
          timestamp: timestamp,
        },
      });

    if (!portfolioSnapshot) {
      return {
        success: false,
        error: "Failed to create portfolio snapshot",
      };
    }

    await updateAchievements(userId, "Price_Update");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error: ", error);

    const errMsg = error instanceof Error ? error.message : "Internal Error";

    return {
      success: false,
      error: errMsg,
    };
  }
}
