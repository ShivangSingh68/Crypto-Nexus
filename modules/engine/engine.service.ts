import { db } from "@/lib/db";
import { Coin } from "@/lib/generated/prisma/client";
import { calculateDemandImpact } from "./demand";
import { calculateMomentum } from "./momentum";
import { Decimal } from "@prisma/client/runtime/library";
import { simulateWhaleActivity } from "./whale";
import { Message } from "@/types/messages";
import {
  applyNewsImpact,
  decaySentiment,
  getSentimentScore,
} from "./sentiment";
import { applyPriceChange, calculatePriceChange } from "./priceEngine";

//cron job
export async function runPriceUpdateForAllCoins(): Promise<Message<Decimal>> {
  try {
    const coins: Coin[] = await db.coin.findMany();
    await Promise.all(
      coins.map(async (coin) => {
        const res = await updateCoinPrice(coin.id);
        if (!res.success) {
          throw new Error(res.error);
        }
      }),
    );
    return {
      success: true,
      msg: "Price for every coin updated",
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

export async function updateCoinPrice(
  coinId: string,
): Promise<Message<Decimal>> {
  try {
    const coin = await db.coin.findUnique({
      where: {
        id: coinId,
      },
    });
    if (!coin) {
      return {
        success: false,
        error: "Invalid coin id",
      };
    }
    const sentiment = coin.sentiment;

    //Decay sentiment for next tick
    const decayedSentiment = decaySentiment(sentiment);

    const prevPrices = await getRecentPrices(6, coin.id);
    const oldPrice = coin.currentPrice;
    const momentum = calculateMomentum(prevPrices);
    const whale = simulateWhaleActivity(coin.liquidity);
    const {buyVolume, sellVolume} = whale;
    const demand = calculateDemandImpact({
        buyVolume: coin.buyVolume.add(buyVolume),
        sellVolume: coin.sellVolume.add(sellVolume),
        liquidity: coin.liquidity,
        type: coin.type,
      });
    const sentimentScore = getSentimentScore(sentiment);

    const priceChange = calculatePriceChange({
      demand,
      momentum,
      sentimentScore,
    });
    const updatedPrice = applyPriceChange(oldPrice, priceChange);
    const updatedCoinPrice = await db.coinPrice.create({
      data: {
        coinId: coin.id,
        price: updatedPrice,
        timestamp: new Date(),
      },
    });
    const updatedCoin = await db.coin.update({
      where: {
        id: coin.id
      },
      data: {
        buyVolume: new Decimal(0),
        sellVolume: new Decimal(0),
        currentPrice: updatedPrice,
        sentiment: decayedSentiment,
      }
    })
    if (!updatedCoinPrice || !updatedCoin) {
      return {
        success: false,
        error: `Failed to price for coin: ${coin.id}`,
      };
    }

    return {
      success: true,
      msg: "Coin price updated successfully",
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

//Might return less than num previous prices if db has no more records
export async function getRecentPrices(num: number, coinId: string) {
    const recentPrice = await db.coinPrice.findMany({
        where: {
            coinId: coinId
        },
        orderBy: {
            timestamp: "asc"
        },
        select: {
            price: true,
        }
    })
    const processedRecentPrice: Decimal[] = recentPrice.map((price) => price.price);
    const len = processedRecentPrice.length;
    if(len <= num) {
      return processedRecentPrice;
    } else {
      return processedRecentPrice.slice(len-num);
    }
}

export async function updateSentimentBasedOnNews(
  newsId: string,
): Promise<Message<Decimal>> {
  try {
    const news = await db.news.findUnique({
      where: {
        id: newsId,
      },
    });
    if (!news) {
      return {
        success: false,
        error: "Invalid news id",
      };
    }
    const coin = await db.coin.findFirst({
      where: {
        id: news.coinId,
      },
    });
    if (!coin) {
      return {
        success: false,
        error: "News not linked to any valid coin",
      };
    }
    const newSentiment = applyNewsImpact(coin.sentiment, news.impact);
    const coinWithUpdatedSentiment = await db.coin.update({
      where: {
        id: coin.id,
      },
      data: {
        sentiment: newSentiment,
      },
    });
    if (!coinWithUpdatedSentiment) {
      return {
        success: false,
        error: "Failed to update coin sentiments",
      };
    }

    return {
      success: true,
      msg: "Coin sentiment updated successfully",
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
