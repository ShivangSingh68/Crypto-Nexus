"use server"

import { GoogleGenAI} from "@google/genai";
import { AIResponse, aiResponseSchema, getPrompt } from "./template";
import { Message } from "@/types/messages";
import { zodToJsonSchema} from "zod-to-json-schema";
import { db } from "@/lib/db";
import { updateSentimentBasedOnNews } from "../engine/engine.service";
import { Decimal } from "@prisma/client/runtime/library";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function generateNewsEvent(timestamp: Date): Promise<Message<AIResponse[]>> {
    try {

        const coins = await db.coin.findMany({
            select: {
                id: true,
                name: true,
                type: true,
            }
        });

        const filteredCoins = coins.filter(() => Math.random() >= 0.7);

        const prompt = getPrompt(filteredCoins);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(aiResponseSchema)
            }
        });

        if(!response.text) {
            return {
                success: false,
                error: "Empty response from AI",
            }
        }

        const parsed: AIResponse[] = aiResponseSchema.parse(JSON.parse(response.text));
        
        await db.news.createMany({
            data: parsed.map(p => ({
                coinId: p.coinId,
                heading: p.heading,
                description: p.description,
                impact: p.impact,
                timestamp,
            }))
        });

        await Promise.all(
            parsed.map(p => updateSentimentBasedOnNews(p.coinId, new Decimal(p.impact)))
        )

        return {
            success: true,
            data: parsed
        }

    } catch (error) {
        
        console.error("Error: ", error);
        
        const errMsg = error instanceof Error ? error.message : "Internal Error";

        return {
            success: false,
            error: errMsg,
        }

    }
} 

