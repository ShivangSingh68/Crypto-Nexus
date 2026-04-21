
import { generateNewsEvent } from "@/modules/news/generateNews";
import { NextResponse } from "next/server";


export async function GET() {

    try {
        
        console.log("Recieved cron reminder for generate news !!");

        const response = await generateNewsEvent(new Date(Date.now()));

        const generatedNews = response.data;

        if(!generatedNews) {
            return NextResponse.json(
                {error: "Failed to generate news"},
                {status: 500},
            )
        }

        return NextResponse.json(
            {message: "News generated successfully"},
            {status: 200}
        )

    } catch (error) {
        
        console.error("Gnerate-news api error: ", error);

        return NextResponse.json(
            {error: "Internal Error"},
            {status: 500}
        )
    }
}