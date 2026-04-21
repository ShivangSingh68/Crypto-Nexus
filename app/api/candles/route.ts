
import { getOHCLdata } from "@/modules/engine/engine.service";
import { NextRequest, NextResponse } from "next/server";

//interval: 4h, 7h, 1d
export async function POST(req: NextRequest) {
    try {
        
        const body = await req.json();

        const {interval = "1d", coinId} = body 
 

        if(!coinId ) {
            return NextResponse.json(
                {error: "Required coinId"},
                {status: 400},
            )
        }

        const valideIntervals = ["4h", "7h", "1d"];

        if(!valideIntervals.includes(interval)) {
            return NextResponse.json(
                {error: "Invalid interval"},
                {status: 400}
            )
        }

        const ohclResponse = await getOHCLdata(coinId, interval);

        if(!ohclResponse.success) {
            return NextResponse.json(
                {error: "Internal error"},
                {status: 500}
            )
        }

        return NextResponse.json(
            {data: ohclResponse.data},
            {status: 200},
        )

    } catch (error) {
        
        console.error("Candle route error: ", error);

        return NextResponse.json(
            {error: "Internal Server error"},
            {status: 500},
        )

    }
}