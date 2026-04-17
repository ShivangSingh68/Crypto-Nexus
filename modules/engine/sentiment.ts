
import { GAME } from "@/config/game";
import { Decimal } from "@prisma/client/runtime/library";


// sentiment ∈ [-1, +1]  but sentimentScore is the actual value that's added to price change
export function getSentimentScore(sentiment: Decimal): Decimal {
    const DAMPING = new Decimal(GAME.SENTIMENT_DAMPING);

    let score = sentiment.mul(DAMPING);

    const MAX = new Decimal(0.05);
    const MIN = new Decimal(-0.05);

    if(score.greaterThan(MAX)) {
        score = MAX;
    }
    if(score.lessThan(MIN)) {
        score = MIN;
    }

    return score;
}

export function decaySentiment(sentiment: Decimal): Decimal {
    const decayFactor = new Decimal(GAME.SENTIMENT_DECAY);

    return sentiment.mul(decayFactor);
}

export function applyNewsImpact(currentSentiment: Decimal, newsImpact: Decimal): Decimal {
    let updatedSentiment = currentSentiment.add(newsImpact);

    const MAX = new Decimal(1);
    const MIN = new Decimal(-1);

    if(updatedSentiment.greaterThan(MAX)) {
        updatedSentiment = MAX;
    } 
    if(updatedSentiment.lessThan(MIN)) {
        updatedSentiment = MIN;
    }
    return updatedSentiment;
}