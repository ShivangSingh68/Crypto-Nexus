
import { z } from "zod";

export function getPrompt(
  coins: {
    id: string;
    type: "AI" | "GAME" | "MEME";
    name: string;
  }[],
) {
  const coinList = coins
    .map((c) => `- coinId: ${c.id}, name: ${c.name}, type: ${c.type}`)
    .join("\n");

return `You are generating fictional market news for a virtual crypto trading game.

Generate ONE unique news item for EACH coin listed below. Return a JSON array.

Coins:
${coinList}

Coin type sentiment ranges:
- MEME: random sentiment from -1.00 to 1.00 (high volatility)
- AI: random sentiment from -0.65 to 0.65 (medium volatility)  
- GAME: random sentiment from -0.35 to 0.35 (low volatility)

Rules:
- Randomly choose positive, negative, or neutral tone each time
- Use varied decimals such as 0.18, -0.72, 0.57, -0.09
- MEME = hype, influencers, panic, viral trends
- AI = launches, partnerships, regulation, innovation
- GAME = updates, tournaments, player growth, bugs, rewards
- Headline under 18 words`;
}

export const aiResponseSchema = z.array(z.object({
  coinId: z.string().describe("Coin ID"),
  heading: z.string().describe("Heading for the news"),
  description: z
    .string()
    .describe("Contains a breif description about the news event"),
  impact: z
    .number()
    .describe("Sentiment of the public based on the news between -1 and +1"),
  source: z.string().describe("Source of the news"),
}));

export type AIResponse = z.infer<typeof aiResponseSchema>[number];
