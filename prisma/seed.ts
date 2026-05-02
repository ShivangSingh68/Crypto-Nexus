import { PrismaClient } from "../lib/generated/prisma/client";
import { AchievementType } from "../lib/generated/prisma/enums";

const db = new PrismaClient();

const ACHIEVEMENTS = [
  {
    type: AchievementType.FIRST_TRADE,
    name: 'First Trade',
    description: 'Executed your very first trade.',
    badge: '/badges/first-trade.png',
  },
  {
    type: AchievementType.FIRST_PROFIT,
    name: 'First Profit',
    description: 'Sold a coin for a profit.',
    badge: '/badges/first-profit.png',
  },
  {
    type: AchievementType.TEN_TRADES,
    name: 'Ten Trades',
    description: 'Completed 10 trades total.',
    badge: '/badges/ten-trades.png',
  },
  {
    type: AchievementType.DOUBLE_PORTFOLIO,
    name: 'Double Up',
    description: 'Doubled your portfolio value.',
    badge: '/badges/double-portfolio.png',
  },
  {
    type: AchievementType.MEME_LORD,
    name: 'Meme Lord',
    description: 'Bought into 5 meme coins.',
    badge: '/badges/meme-lord.png',
  },
  {
    type: AchievementType.AI_VISIONARY,
    name: 'AI Visionary',
    description: 'Bought into 5 AI coins.',
    badge: '/badges/ai-visionary.png',
  },
  {
    type: AchievementType.TOP_TEN,
    name: 'Top Ten',
    description: 'Ranked in the top 10 traders.',
    badge: '/badges/top-ten.png',
  },
  {
    type: AchievementType.RANK_ONE,
    name: 'Rank One',
    description: 'Reached #1 on the leaderboard.',
    badge: '/badges/rank-one.png',
  },
  {
    type: AchievementType.MILLIONAIRE,
    name: 'Millionaire',
    description: 'Portfolio value exceeded $1,000,000.',
    badge: '/badges/millionaire.png',
  },
];

async function main() {
  console.log('Seeding achievements...');

  for (const achievement of ACHIEVEMENTS) {
    await db.achievement.upsert({
      where: { type: achievement.type },
      update: {
        name: achievement.name,
        description: achievement.description,
      },
      create: {
        name: achievement.name,
        description: achievement.description,
        type: achievement.type,
        badge: {
            create: {
                image: achievement.badge
            }
        }
      },
    });
  }

  console.log(`Seeded ${ACHIEVEMENTS.length} achievements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });