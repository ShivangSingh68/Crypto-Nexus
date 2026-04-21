
import { getCurrentUser } from "@/modules/auth/actions";
import { executeUserTrade } from "@/modules/trading/trading.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
            
    const body = await req.json();

    const {userId, coinId, type, quantity} = body;

    const currrentUser = await getCurrentUser();
    
    if(!currrentUser) {
        return NextResponse.json(
            {
            error: "Unauthorized User",
            }, {status: 401

            }
        )
    }

    if(currrentUser.id !== userId) {
        return NextResponse.json({
            error: "User not validated"
        },
        {status: 401},
        )
    }

    const tradeResponse = await executeUserTrade(userId, coinId, quantity, type);

    if(!tradeResponse.success) {
        return NextResponse.json({
            error: tradeResponse?.error || "Trade Failed"
        }, {status: 402});
    }

    return NextResponse.json({
        message: tradeResponse.msg
    }, {status: 200});

    } catch (error) {

        console.error("Trade route error: ", error);

        return NextResponse.json({
            error: "Something went wrong"
        }, {
            status: 500
        })
    }
}