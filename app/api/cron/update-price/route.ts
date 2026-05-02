
import { db } from "@/lib/db";
import { runPriceUpdateForAllCoins } from "@/modules/engine/engine.service";
import { createPortfolioSnapshot } from "@/modules/portfolio/portfolio.service";
import { NextResponse } from "next/server"


export async function GET() {
    try {
        
        console.log("Received cron reminder for update-price");
        const currTimestamp = new Date();
        const response = await runPriceUpdateForAllCoins(currTimestamp);

        if(!response.success) {
            return NextResponse.json(
                {error: response.error},
                {status: 500},
            )
        }

        const users = await db.user.findMany();

        await Promise.all(users.map(async(u) => createPortfolioSnapshot(u.id, currTimestamp)))

        return NextResponse.json(
            {message: "Price updated for each coin successfully"},
            {status: 200},
        )

    } catch (error) {
        
        console.error("Error in update-price api route: ", error);

        return NextResponse.json(
            {error: "Internal error"},
            {status: 500},
        )

    }
}