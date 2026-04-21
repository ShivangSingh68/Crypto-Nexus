
import { getLeaderboardSummary, getRankedPortfolios, getTopGainers24h, getTopLosers24h } from "@/modules/leaderboard/leaderboard.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        
        const type = req.nextUrl.searchParams.get("type");

        if(!type) {
            return NextResponse.json(
                {error: "type is required"},
                {status: 400}
            )
        }

        let leaderboard;
        
        if(type === "TOPGAINERS") {

            leaderboard = (await getTopGainers24h()).data;

        } else if(type === "TOPLOSERS") {

            leaderboard = (await getTopLosers24h()).data;

        } else if(type === "TOPPORTFOLIOS") {

            leaderboard = (await getRankedPortfolios());

        } else {
            return NextResponse.json(
                {error: "Invalid leaderboard type"},
                {status: 400},
            )
        }
        
        const leaderboardSummary = await getLeaderboardSummary();

        return NextResponse.json(
            {
                leaderboard,
                leaderboardSummary,
            },
            {status: 200},
        )

    } catch (error) {
        
        console.error("Leaderboard route error: ", error);

        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )

    }
}