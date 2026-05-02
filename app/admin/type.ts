
type StatLabel = "Total Users" | "Total Coins" | "Trades Today" | "Volume 24h" | "Active Users" | "News Generated"; 

type ControlLabel = "Trigger Price Update" | "Generate News Cycle" | "Run Monthly Rewards" | "Reset Market Prices";

export enum StatIcons {
    TOTAL_USERS = '👥',
    TOTAL_COINS= '⬡',
    TRADES_TODAY= '⚡',
    VOLUME_24H= '📊',
    ACTIVE_USERS= '🟢',
    NEWS_GENERATED= '📡',
};

enum ControlIcons {
    TRIGGER_PRICE_UPDATE= '🔄',
    GENERATE_NEWS_CYCLE= '📡',
    RUN_MONTHLY_REWARDS= '🏅',
    RESET_MARKET_PRICE= '⚠️',
}

export interface Stat {
    label: StatLabel,
    value: string,
    icon: StatIcons,
    color: string,
}

export interface Control {
    label: ControlLabel,
    icon: ControlIcons,
    color: string,
}

export interface AdminCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  active: boolean;
  color: string;
  trades: number;
}

export type CreateCoinParams = {
  symbol: string;
  name: string;
  initialPrice: string;
  maxSupply: string;
  description: string;
  color: string;
  category: "meme" | "ai" | "game";
};