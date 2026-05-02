"use client";

import { useState } from "react";
import { CoinDetail } from "../type";
import { useBalanceAndHolings } from "../hooks/useBalance";
import { executeTrade } from "../action";
import { useRouter } from "next/navigation";
import { achievementToast, toast } from "@/components/toaster";

const ACHIEVEMENT_META: Record<string, { icon: string; description: string }> =
  {
    FIRST_TRADE: {
      icon: "/badges/first-trade.png",
      description: "Executed your very first trade.",
    },
    FIRST_PROFIT: {
      icon: "/badges/first-profit.png",
      description: "Sold a coin for a profit.",
    },
    TEN_TRADES: {
      icon: "/badges/ten-trades.png",
      description: "Completed 10 trades total.",
    },
    DOUBLE_PORTFOLIO: {
      icon: "/badges/double-portfolio.png",
      description: "Doubled your portfolio value.",
    },
    MEME_LORD: {
      icon: "/badges/meme-lord.png",
      description: "Bought into 5 meme coins.",
    },
    AI_VISIONARY: {
      icon: "/badges/ai-visionary.png",
      description: "Bought into 5 AI coins.",
    },
    TOP_TEN: {
      icon: "/badges/top-ten.png",
      description: "Ranked in the top 10 traders.",
    },
    RANK_ONE: {
      icon: "/badges/rank-one.png",
      description: "Reached #1 on the leaderboard.",
    },
    MILLIONAIRE: {
      icon: "/badges/millionaire.png",
      description: "Portfolio value exceeded $1,000,000.",
    },
  };

interface TradePanelProps {
  coin: CoinDetail;
}

const sellStyle = {
  background:
    "linear-gradient(135deg, rgba(243,139,168,0.15), rgba(203,166,247,0.08))",
  borderColor: "rgba(243,139,168,0.38)",
  color: "#f38ba8",
};

export default function TradePanel({ coin }: TradePanelProps) {
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState("");
  const { balance, holdings, loading } = useBalanceAndHolings(coin.id);
  const [tradeState, setTradeState] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const router = useRouter();

  const qty = parseFloat(amount) || 0;
  const total = coin.currentPrice * qty;
  const maxBUY = balance / coin.currentPrice;

  const handleTrade = async () => {
    if (!qty) return;
    setTradeState("loading");
    try {
      const result = await executeTrade(coin.id, qty, mode);
      if (result.success) {
        // Trade success toast
        toast(
          "success",
          `${mode === "BUY" ? "Bought" : "Sold"} ${qty} ${coin.ticker}`,
          `${mode === "BUY" ? "Spent" : "Received"} $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        );

        // Achievement toasts
        if (result.data.length) {
          result.data.forEach((type: string, i: number) => {
            const meta = ACHIEVEMENT_META[type] ?? {
              icon: "/badges/default.png",
              description: "New achievement unlocked.",
            };
            setTimeout(() => {
              achievementToast(
                type.replace(/_/g, " "), // "FIRST TRADE" — still the raw type
                meta.description,
                meta.icon, // this is the image path
              );
            }, i * 600);
          });
        }

        setTradeState("done");
        setTimeout(() => {
          setTradeState("idle");
          router.push(`/coin/${coin.id}`);
        }, 1200);
      } else {
        toast("error", "Trade Failed", result.error ?? "Something went wrong.");
        setTradeState("idle");
      }
    } catch {
      toast("error", "Trade Failed", "Unexpected error. Please try again.");
      setTradeState("idle");
    }
    setAmount("");
  };

  const pcts = [0.25, 0.5, 0.75, 1];

  const skeletonBox = (w: string, h = "0.85rem") => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "6px",
        background: "rgba(180,190,254,0.08)",
      }}
    />
  );

  return (
    <div
      className="nx-card"
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Title */}
      <div
        className="font-orbitron"
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#a6adc8",
        }}
      >
        Trade {coin.ticker}
      </div>

      {/* BUY / SELL toggle */}
      <div
        style={{
          display: "flex",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(180,190,254,0.1)",
        }}
      >
        <button
          onClick={() => setMode("BUY")}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.75rem",
            fontFamily: "Orbitron",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            border: "none",
            opacity: loading ? 0.5 : 1,
            background:
              mode === "BUY" ? "rgba(166,227,161,0.15)" : "transparent",
            color: mode === "BUY" ? "#a6e3a1" : "#585b70",
          }}
        >
          BUY
        </button>
        <button
          onClick={() => setMode("SELL")}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.75rem",
            fontFamily: "Orbitron",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            border: "none",
            borderLeft: "1px solid rgba(180,190,254,0.1)",
            opacity: loading ? 0.5 : 1,
            background:
              mode === "SELL" ? "rgba(243,139,168,0.15)" : "transparent",
            color: mode === "SELL" ? "#f38ba8" : "#585b70",
          }}
        >
          SELL
        </button>
      </div>

      {/* Balance info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderRadius: "10px",
          background: "rgba(17,17,27,0.6)",
          border: "1px solid rgba(180,190,254,0.07)",
        }}
      >
        <span
          className="font-rajdhani"
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#585b70",
          }}
        >
          {mode === "BUY" ? "Available" : "Holdings"}
        </span>
        {loading ? (
          skeletonBox("6rem")
        ) : (
          <span
            className="font-mono-tech"
            style={{ fontSize: "0.85rem", color: "#b4befe" }}
          >
            {mode === "BUY"
              ? `$${balance.toLocaleString()}`
              : `${holdings} ${coin.ticker}`}
          </span>
        )}
      </div>

      {/* Amount input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label className="nx-label">Quantity ({coin.ticker})</label>
        <div style={{ position: "relative" }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min={0}
            disabled={loading}
            className="nx-input appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            style={{
              paddingRight: "4rem",
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "text",
            }}
          />
          <span
            className="font-orbitron"
            style={{
              position: "absolute",
              right: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.62rem",
              color: "#585b70",
              pointerEvents: "none",
            }}
          >
            {coin.ticker}
          </span>
        </div>
      </div>

      {/* Quick pct buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "0.5rem",
        }}
      >
        {pcts.map((p) => (
          <button
            key={p}
            onClick={() =>
              setAmount(
                mode === "BUY"
                  ? (maxBUY * p).toFixed(6)
                  : (holdings * p).toFixed(6),
              )
            }
            disabled={loading}
            className="nx-ctrl-btn"
            style={{
              justifyContent: "center",
              padding: "0.5rem 0.25rem",
              fontSize: "0.72rem",
              color: "#7f849c",
              opacity: loading ? 0.4 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {p * 100}%
          </button>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.85rem 1rem",
          borderRadius: "12px",
          background: "rgba(17,17,27,0.6)",
          border: "1px solid rgba(180,190,254,0.08)",
        }}
      >
        <span
          className="font-rajdhani"
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#585b70",
          }}
        >
          Total
        </span>
        {loading ? (
          skeletonBox("5rem")
        ) : (
          <span
            className="font-mono-tech"
            style={{ fontSize: "0.95rem", color: "#cdd6f4" }}
          >
            $
            {total > 0
              ? total.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : "0.00"}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleTrade}
        disabled={loading || !qty || tradeState !== "idle"}
        className={
          tradeState === "done"
            ? "nx-btn-primary nx-btn-success"
            : "nx-btn-primary"
        }
        style={
          loading
            ? { opacity: 0.4, cursor: "not-allowed" }
            : mode === "SELL" && tradeState !== "done"
              ? sellStyle
              : {}
        }
      >
        {loading ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span className="nx-spinner" /> Loading...
          </span>
        ) : tradeState === "loading" ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              className="nx-spinner"
              style={mode === "SELL" ? { borderTopColor: "#f38ba8" } : {}}
            />
            {mode === "BUY" ? "Buying..." : "Selling..."}
          </span>
        ) : tradeState === "done" ? (
          "✓ Done!"
        ) : mode === "BUY" ? (
          `BUY ${coin.ticker}`
        ) : (
          `SELL ${coin.ticker}`
        )}
      </button>

      <p
        className="font-rajdhani"
        style={{
          fontSize: "0.65rem",
          color: "#45475a",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Virtual trading only · No real money involved
      </p>
    </div>
  );
}
