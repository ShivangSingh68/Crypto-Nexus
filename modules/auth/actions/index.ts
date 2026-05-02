"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUserById = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId,
            }
        })
        
        return account;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getCurrentUser = async () => {
    const authData = await auth();
    const user = await db.user.findFirst({
      where: {
        id: authData.user.id
      }
    })

    return user;
};

export const getActiveUsers = async() => {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeUsers = await db.user.findMany({
    where: {
      lastTradeAt: {
        gte: sevenDaysAgo,
      }
    }
  })

  return activeUsers.length;
}