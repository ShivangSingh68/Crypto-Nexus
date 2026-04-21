
import { runPriceUpdateForAllCoins } from "@/modules/engine/engine.service";
import { NextResponse } from "next/server"


export async function GET() {
    try {
        
        console.log("Received cron reminder for update-price");

        const response = await runPriceUpdateForAllCoins();

        if(!response.success) {
            return NextResponse.json(
                {error: response.error},
                {status: 500},
            )
        }

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