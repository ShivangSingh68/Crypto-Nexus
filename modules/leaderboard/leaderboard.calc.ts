
import { PortfolioSnapshot } from "@/lib/generated/prisma/client";
import { LatestPortfolioSnapshotView} from "./leaderboard.types";
import { Decimal } from "@prisma/client/runtime/library";

export function rankUsers(
  portfolios: LatestPortfolioSnapshotView[]
): LatestPortfolioSnapshotView[] {
  return portfolios
    .sort(
      (a, b) =>
        b.netWorth.toNumber() - a.netWorth.toNumber()
    );
}

export function calculateDayChange(snapshots: PortfolioSnapshot[]): {dayChange: Decimal, dayChangePct: Decimal} {
  const offset = 24*60*60*1000;
  const len = snapshots.length;
  const latestPrice = snapshots[len-1].value;
  let oldPrice = snapshots[0].value;
  for(const s of snapshots) {
    if(s.timestamp.getTime() >= Date.now() - offset) {
      oldPrice = s.value;
      break;
    }
  }

  const dayChange = latestPrice.sub(oldPrice);
  let dayChangePct = new Decimal(0);
  
  if(!oldPrice.eq(0)) {
    dayChangePct = dayChange.div(oldPrice);
  }

  return {dayChange, dayChangePct};
}
