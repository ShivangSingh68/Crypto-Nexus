//TODO:

import { LatestPortfolioSnapshotView} from "./leaderboard.types";


export function rankUsers(
  portfolios: LatestPortfolioSnapshotView[]
): LatestPortfolioSnapshotView[] {
  return portfolios
    .filter((p) => p.snapshots.length > 0)
    .sort(
      (a, b) =>
        b.snapshots[0].value.toNumber() -
        a.snapshots[0].value.toNumber()
    );
}
