"use server";

import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { Decimal } from "@prisma/client/runtime/library";
import { validateBuy, validateSell } from "./validateTrade";
import { AchievementType, Coin } from "@/lib/generated/prisma/client";
import { updateAchievements } from "../achievements/achievements.service";

export async function executeUserTrade(
  userId: string, coinId: string, quantity: Decimal, type: "BUY" | "SELL"
): Promise<Message<AchievementType[]>> {
  try {

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return {
        success: false,
        error: "No such user present",
      };
    }
    const coin = (await db.coin.findUnique({
      where: {
        id: coinId,
      },
    })) as Coin;
    if (!coin) {
      return {
        success: false,
        error: "Invalid coin id",
      };
    }

    const portfolio = await db.portfolio.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!portfolio) {
      return {
        success: false,
        error: "No portfolio linked to the user",
      };
    }

    let avgBuyPrice = new Decimal(0);
    if (type === "BUY") {
      const res = validateBuy(
        quantity,
        portfolio.cash,
        coin.currentPrice,
        coin.type,
      );
      if (!res.success) {
        return {
          success: false,
          error: res.error,
        };
      }
      const { buyPrice, tax } = res.data!;
      const existingHolding = await db.holding.findUnique({
        where: {
          portfolioId_coinId: {
            portfolioId: portfolio.id,
            coinId,
          },
        },
      });
      await db.$transaction(async (tx) => {
        await tx.holding.upsert({
          where: {
            portfolioId_coinId: {
              portfolioId: portfolio.id,
              coinId: coin.id,
            },
          },
          create: {
            coinId,
            portfolioId: portfolio.id,
            quantity,
            avgBuyPrice: coin.currentPrice,
          },
          update: {
            quantity: { increment: quantity },
            avgBuyPrice: existingHolding
              ? existingHolding.avgBuyPrice
                  .mul(existingHolding.quantity)
                  .add(coin.currentPrice.mul(quantity))
                  .div(existingHolding.quantity.add(quantity))
              : coin.currentPrice,
          },
        });
        await tx.portfolio.update({
          where: {
            id: portfolio.id,
          },
          data: {
            cash: portfolio.cash.sub(buyPrice).sub(tax),
          },
        });
        await tx.coin.update({
          where: {
            id: coinId,
          },
          data: {
            buyVolume: coin.buyVolume.add(buyPrice),
          },
        });
        await tx.trade.create({
          data: {
            traderId: user.id,
            coinId: coin.id,
            portfolioId: portfolio.id,
            type,
            tradeValue: buyPrice,
            coinCount: quantity,
            priceAtExecution: coin.currentPrice,
            fee: tax,
            timestamp: new Date(),
          },
        });
      });
    } else if (type === "SELL") {
      const coinHolding = await db.holding.findFirst({
        where: {
          portfolioId: portfolio.id,
          coinId: coinId,
        },
        select: {
          quantity: true,
          avgBuyPrice: true,
        },
      });
      if (!coinHolding) {
        return {
          success: false,
          error: "Failed to find coin holding for this portfolio",
        };
      }
      avgBuyPrice = coinHolding.avgBuyPrice;
      const res = validateSell(
        quantity,
        coinHolding.quantity,
        coin.currentPrice,
        coin.type,
      );
      if (!res.success) {
        return {
          success: false,
          error: res.error,
        };
      }

      const { sellPrice, tax } = res.data!;
      await db.$transaction(async (tx) => {
        if (quantity.eq(coinHolding.quantity)) {
          await tx.holding.delete({
            where: {
              portfolioId_coinId: {
                portfolioId: portfolio.id,
                coinId,
              },
            },
          });
        } else {
          await tx.holding.update({
            where: {
              portfolioId_coinId: {
                portfolioId: portfolio.id,
                coinId: coin.id,
              },
            },
            data: {
              quantity: coinHolding.quantity.sub(quantity),
            },
          });
        }
        await tx.portfolio.update({
          where: {
            id: portfolio.id,
          },
          data: {
            cash: portfolio.cash.add(sellPrice).sub(tax),
          },
        });
        await tx.coin.update({
          where: {
            id: coin.id,
          },
          data: {
            sellVolume: coin.sellVolume.add(sellPrice),
          },
        });
        await tx.trade.create({
          data: {
            traderId: user.id,
            coinId: coin.id,
            portfolioId: portfolio.id,
            type,
            tradeValue: sellPrice,
            coinCount: quantity,
            priceAtExecution: coin.currentPrice,
            fee: tax,
            timestamp: new Date(),
          },
        });
      });
    } else {
      return {
        success: false,
        error: "Invalid trade type",
      };
    }

    await db.user.update({
      where: {
        id: userId,
      }, 
      data: {
        lastTradeAt: new Date(Date.now()),
      }
    })
    const updatedAchievementRes = await updateAchievements(userId, "Trade", avgBuyPrice);
    if(!updatedAchievementRes.success) {
      throw new Error(updatedAchievementRes.error);
    }
    return {
      success: true,
      msg: "Trade executed successfully",
      data: updatedAchievementRes.data
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

export async function getTradesToday(): Promise<Message<number>> {
  try {
    
    const trades = await db.trade.findMany({
      orderBy: {
        timestamp: "asc"
      }
    });

    const offset = 24*60*60*1000;

    const todayTrades = trades.filter( t => t.timestamp.getTime() >= Date.now() - offset);

    return {
      success: true,
      data: todayTrades.length,
    }

  } catch (error) {
      
    console.error("Failed to calculate today's trade: ", error);
      
      const errMsg = error instanceof Error ? error.message : "Something went wrong";

      return {
        success: false,
        error: errMsg,
      }
  }
}

export async function getVolume24H(): Promise<Message<number>> {
  try {
    
    const coins = await db.coin.findMany();
    
    let volume24h = new Decimal(0);

    for(const c of coins) {
      volume24h = volume24h.add(c.buyVolume).add(c.sellVolume);
    }

    return {
      success: true,
      data: volume24h.toNumber(),
    }

  } catch (error) {
    
    console.error("Failed to get volume 24h: ", error);

    const errMsg = error instanceof Error ? error.message : "Something went wrong";

    return {
      success: false,
      error: errMsg,
    }
  }
}

export async function getMarketCap(): Promise<Message<number>> {
  try {
    
    const trades = await db.trade.findMany();

    let marketCap = new Decimal(0);

    for(const t of trades) {
      marketCap = marketCap.add(t.tradeValue);
    }

    return {
      success: true,
      data: marketCap.toNumber(),
    }

  } catch (error) {
    
    console.error("Failed to calculate market cap: ", error);

    const errMsg = error instanceof Error ? error.message : "Something went wrong";

    return {
      success: false,
      error: errMsg,
    }

  }
}