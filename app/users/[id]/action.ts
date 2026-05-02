"use server";

import {
  getPortfolioSummary,
  getUserPortfolio,
} from "@/modules/portfolio/portfolio.service";
import { Achievement, Holding, Stats, UserSettingForm } from "./types";
import { getUserAchievements } from "@/modules/achievements/achievements.service";
import { getCurrentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";
import { Message } from "@/types/messages";
import { signOut } from "@/auth";
import { v2 as cloudinary } from 'cloudinary';


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
      };
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

    if (!stats.success) {
      console.error(stats.error);
      return {} as Stats;
    }

    const processedStats: Stats = {
      cashBalance: stats.data.cashBalance.toNumber(),
      dayChange: stats.data.dayChange.toNumber(),
      dayChangePct: stats.data.dayChangePct.toNumber(),
      netWorth: stats.data.totalValue.toNumber(),
      pnlPct: stats.data.pnlPercentage.toNumber(),
      totalInvested: stats.data.totalValue
        .sub(stats.data.cashBalance)
        .toNumber(),
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

    if (!achievements.success) {
      return [];
    }

    const processedAchievements: Achievement[] = achievements.data.map(
      (ac) => ({
        icon: ac.achievement.badge.image,
        desc: ac.achievement.description,
        id: ac.id,
        label: ac.achievement.name,
        progress: ac.progress,
        unlocked: ac.unlocked,
      }),
    );

    return processedAchievements;
  } catch (error) {
    console.error("Failed to fetch user achievements: ", error);

    return [];
  }
}

async function uploadToCloudinary(
  file: File,
  prevPublicId?: string,
): Promise<Message<string>> {
  try {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadFormData = new FormData();
    if (file.size > 4 * 1024 * 1024) {
      throw new Error("File size more than 4MB");
    }

    uploadFormData.append("file", file);
    uploadFormData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET,
    );

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "post",
        body: uploadFormData,
      },
    );

    const image = await uploadResponse.json();

    if (prevPublicId && image) {
        const deleteResponse = await cloudinary.uploader.destroy(prevPublicId);
        if(deleteResponse.result !== 'ok') {
            return {
                success: false,
            }
        }
    }
    return {
      success: true,
      data: image.secure_url,
    };
  } catch (error) {
    console.error(error);

    const errMsg =
      error instanceof Error ? error.message : "Something Went wrong";
    return {
      success: false,
      error: errMsg,
    };
  }
}

export async function onUserSettingSave(
  props: UserSettingForm,
): Promise<Message<boolean>> {
  try {
    const { avatar, bio, displayName, location } = props;
    const currUser = await getCurrentUser();
    let image = currUser.image;
    let prevPublicId;
    if(image.startsWith('https://res.cloudinary.com')) {
        const arr = image.split('/');
        prevPublicId = arr[arr.length-1].split('.')[0];
    }
    if (avatar) {
      const res = await uploadToCloudinary(avatar, prevPublicId);
      if (res.success) {
        image = res.data;
      } else {
        return {
          success: false,
          error: res.error,
        };
      }
    }

    const updatedUser = await db.user.update({
      where: {
        id: currUser.id,
      },
      data: {
        bio: bio ?? "",
        displayName: displayName,
        location: location ?? "-",
        image: image,
      },
    });
    return {
      success: !!updatedUser,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
    };
  }
}

export async function onUserDelete(): Promise<boolean> {
  try {
    const currUser = await getCurrentUser();
    const deletedUser = await db.user.delete({
      where: {
        id: currUser.id,
      },
    });
    if (!deletedUser) {
      return false;
    }
    await signOut({ redirect: false});
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function onLogout() {
    await signOut();
}
