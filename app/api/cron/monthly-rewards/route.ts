
import { db } from "@/lib/db";
import { NextResponse } from "next/server"


//Give every user that traded last month a $500 bonus
export async function GET() {
    try {
        
        console.log("Recieved cron reminder for monthly-rewards");

        const users = await db.user.findMany();

        const cutoff = Date.now() - 30*24*60*60*1000;

        await Promise.all(users.map(async (u) => {
            if(u.lastTradeAt && u.lastTradeAt.getTime() >= cutoff) {
                await db.portfolio.update({
                    where: {
                        userId: u.id,
                    },
                    data: {
                        cash: {
                            increment: 500,
                        },
                        lastMonthlyRewardAt: new Date(),
                    }
                })
            }
        }))

        return NextResponse.json(
            {message: "Sent monthly rewards to active users"},
            {status: 200},
        )

    } catch (error) {
        
        console.error("Error in monthly routes api: ", error);

        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500},
        )

    }
}