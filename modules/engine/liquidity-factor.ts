
import { Decimal } from "@prisma/client/runtime/library";

export function getLiquidityFactor(
  liquidity: Decimal,
  type: "AI" | "GAME" | "MEME",
): Decimal {
  if (liquidity.eq(0)) {
    return new Decimal(0);
  }

  const BASE =
    type === "MEME"
      ? new Decimal(5000)
      : type === "AI"
        ? new Decimal(15000)
        : new Decimal(50000);

  const liquidityFactor = BASE.div(liquidity.add(BASE));

  return liquidityFactor;
}
