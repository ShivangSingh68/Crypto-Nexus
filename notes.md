 
# Crypto Nexus

It is a web app/ game where users get virtual money to invest, trade virtual crypto coins.

## Project details
- At the time of new user registration every user gets starting $10,000 to invest
- there will be a admin for the market (i.e *me*) which can introduce new coins in the market
- each coin must have limited quantity as the real crypto market works 
- each user can buy and sell coins in their respective portfolio 
- each user will get bonus cash ($500) every month to represent real world inflation
- Reset leaderboard after every season (3 months) + give badges to top 10
- Achievement system
  
        “First Profit”
        “100 Trades Completed”
        “10x Portfolio”
        “Survived Crash”
- the website will have a leaderboard for both: today's most profitable users and most losing users
- It will also have a leaderboard for the richest user based on its portfolio evaluation (depended on coin price * number of coins + liquid cash) 
- I think it must have a news feed where we can have random positive or negative news (made by AI) that will fluctuate the price of coin
- In addition the coin price must depend on following

        # Real World	                # Game Version

        Supply	                        Available coins
        Demand	                        Player buys
        Sentiment	                Hype meter / news
        Whales	                        Big AI players
        Liquidity	                Market depth stat
        News/Regulation	                Random events
        Momentum	                Trend multiplier
- Will also have a treemap or market heatmap to represent market cap of each coin
- the coin price will change every half hour depending on certain algorithm and little bit randomness
- will also have a candlestick chart
- cron job will be needed for $500 drop every month for active user only
- Logic for price
```
    price = price * (
    1 
    + demandFactor 
    + sentimentFactor 
    + momentumFactor 
    + whaleImpact 
    + randomness
    )

    demandFactor = (buyVolume - sellVolume) / liquidity
    sentimentFactor [-1, 1]
        decay over time =  0.9* sentimentFactor
```
- randomly buy or sell large chunks to simulate whale movement
- each coin should have liquidity score (low = volatile, hight= stable)
- Instead of random coins:
  
        Attribute	Example
        Volatility	High / Medium / Low
        Supply	Fixed / Inflationary
        Sector	AI / Meme / Gaming
        Liquidity	Low cap vs Large cap
- Add trade fee to avoid spam trading

## Cron Jobs
- price update(every 30mins)
- monthly rewards
- news generation
- will use https://cron-job.org/

## Coins
- name, logo, volatility score, type(AI, meme, game)
  
## Coin Price Schema
- id, coinId, timestamp, seasonId, price


## Technical details
- next.js project
- neondb with prisma orm
- auth using Auth.js
- frontend will be pastel and pixel game-like (dark purple themed)
- ws for game like UX

        Prices → update every 30 mins (cron + polling)
        Events → push via WebSockets

## Coin Price Engine
```
buyVolume = 5000
sellVolume = 2000
netDemand = 3000

liquidity = 10000

priceChange = 3000 / 10000 = 0.3 = +30%

//Damping to stabalize
priceChange = (netDemand / liquidity) * 0.1

if (lastPriceChange > 0) momentum = +0.02
else momentum = -0.02

sentiment = between -0.05 to +0.05

Random Noise
random = Math.random() * 0.02 - 0.01


Final
const netDemand = buyVolume - sellVolume;

const demandImpact = (netDemand / liquidity) * 0.1;

const priceChange =
  demandImpact +
  momentum +
  sentiment +
  random;

price = price * (1 + priceChange);
```

## Candlestick graph
- will use https://tradingview.github.io/lightweight-charts/docs/series-types#candlestick
- 


## Project Architecture
2. FINAL STRUCTURE (Refined)

Your structure + improvements:

app/
modules/
hooks/
lib/
types/
config/
prisma/
📁 3. APP FOLDER (Detailed)
🧑‍💻 /app/api
/api/trades/route.ts
handles buy/sell requests
calls trading module
/api/candles/route.ts
returns OHLC data
/api/leaderboard/route.ts
returns rankings
/api/cron/update-price/route.ts
runs price engine
inserts price history
/api/cron/monthly-rewards/route.ts
adds $500
/api/cron/generate-news/route.ts
creates news
updates sentiment
📊 /app/market
market/
  page.tsx
  actions.ts
  components/
    coin-card.tsx
    market-table.tsx
  hooks/
    useMarketData.ts
🪙 /app/coin/[id]
coin/[id]/
  page.tsx
  actions.ts
  components/
    price-chart.tsx
    trade-panel.tsx
    coin-stats.tsx
  hooks/
    useCoin.ts
    useCandles.ts
💼 /app/portfolio
portfolio/
  page.tsx
  actions.ts
  components/
    portfolio-table.tsx
    pnl-card.tsx
  hooks/
    usePortfolio.ts
🏆 /app/leaderboard
leaderboard/
  page.tsx
  actions.ts
  components/
    leaderboard-table.tsx
📰 /app/news
news/
  page.tsx
  components/
    news-card.tsx
🛠 /app/admin
admin/
  page.tsx
  components/
    create-coin-form.tsx
    coin-list.tsx
🔁 4. HOOKS (Your structure is good)

Add clarity:

hooks/
  useMarket.ts        → fetch all coins
  usePortfolio.ts     → fetch portfolio
  useWS.ts            → websocket events
  useCandles.ts       → candle data
🧠 5. MODULES (MOST IMPORTANT)
⚙️ /modules/engine
engine/
  priceEngine.ts        → main formula
  demand.ts             → buy/sell calc
  sentiment.ts          → news impact
  momentum.ts           → trend logic
  whale.ts              → whale simulation
💰 /modules/trading
trading/
  executeTrade.ts       → main trade handler
  validateTrade.ts      → check balance, etc
  fees.ts               → fee calc
  positions.ts          → handle shorting
📊 /modules/portfolio
portfolio/
  getPortfolio.ts       → fetch user portfolio
  calculateValue.ts     → total value
  pnl.ts                → profit/loss
🏆 /modules/leaderboard
leaderboard/
  computeLeaderboard.ts → rankings
  topMovers.ts          → gainers/losers
📰 /modules/news
news/
  generateNews.ts       → AI/random news
  sentimentImpact.ts    → affects price
🎯 /modules/achievements
achievements/
  checkAchievements.ts
  rewardAchievements.ts
🔐 /modules/auth

Already good 👍

🗄️ 6. LIB (IMPORTANT ADDITION)
lib/
  db.ts                → Prisma client
  auth.ts              → Auth config
  websocket.ts         → WS setup
  constants.ts         → app constants
  utils.ts             → helpers
⚙️ 7. CONFIG
config/
  game.ts