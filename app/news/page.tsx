"use client";

import NewsCard from "./components/news-card";
import { useNews } from "./hooks/useNews";

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: "1.25rem",
        border: "1px solid rgba(180,190,254,0.08)",
        borderLeft: "4px solid rgba(180,190,254,0.1)",
        background: "rgba(24,24,37,0.9)",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            height: "1.4rem",
            width: "5rem",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.08)",
          }}
        />
        <div
          style={{
            height: "1.4rem",
            width: "3.5rem",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.05)",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            height: "0.85rem",
            width: "100%",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.08)",
          }}
        />
        <div
          style={{
            height: "0.85rem",
            width: "80%",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.08)",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div
          style={{
            height: "0.65rem",
            width: "100%",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.05)",
          }}
        />
        <div
          style={{
            height: "0.65rem",
            width: "75%",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.05)",
          }}
        />
        <div
          style={{
            height: "0.65rem",
            width: "55%",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.05)",
          }}
        />
      </div>
      <div
        style={{
          paddingTop: "1rem",
          borderTop: "1px solid rgba(180,190,254,0.07)",
        }}
      >
        <div
          style={{
            height: "0.6rem",
            width: "7rem",
            borderRadius: "999px",
            background: "rgba(180,190,254,0.05)",
          }}
        />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const { news, isLoading, tickerItems } = useNews();

  const bullish = news.filter((n) => n.tag === "bullish");
  const bearish = news.filter((n) => n.tag === "bearish");
  const neutral = news.filter((n) => n.tag === "neutral");

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Ticker */}
      <div
        style={{
          background: "#11111b",
          borderBottom: "1px solid rgba(180,190,254,0.08)",
          overflow: "hidden",
          padding: "0.75rem 0",
        }}
      >
        <div style={{ display: "flex" }}>
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="animate-ticker"
              style={{
                display: "flex",
                gap: "2rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
                minWidth: "100%",
              }}
            >
              {tickerItems.map((item, i) => {
                const isNeg = item.includes("-");
                return (
                  <span
                    key={i}
                    className="font-mono-tech"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      color: isNeg ? "#f38ba8" : "#a6e3a1",
                      flexShrink: 0,
                    }}
                  >
                    {item}
                    <span style={{ color: "#313148", margin: "0 1rem" }}>
                      |
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="page-wrapper">
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <span
              className="live-dot font-orbitron"
              style={{
                fontSize: "0.72rem",
                color: "#00f5ff",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Live Feed
            </span>
          </div>
          <h1
            className="font-orbitron"
            style={{
              fontWeight: 900,
              fontSize: "1.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#cdd6f4",
              marginBottom: "0.5rem",
            }}
          >
            Market Intel
          </h1>
          <p
            className="font-rajdhani"
            style={{ color: "#7f849c", fontSize: "1rem" }}
          >
            Simulated market news
          </p>
        </div>

        {/* Stat pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          {[
            { count: bullish.length, label: "Bullish", color: "#a6e3a1" },
            { count: bearish.length, label: "Bearish", color: "#f38ba8" },
            { count: neutral.length, label: "Neutral", color: "#f9e2af" },
          ].map(({ count, label, color }) => (
            <div
              key={label}
              style={{
                borderRadius: "1rem",
                padding: "1.25rem",
                textAlign: "center",
                background: `${color}09`,
                border: `1px solid ${color}30`,
              }}
            >
              <div
                className="font-orbitron"
                style={{
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color,
                  marginBottom: "0.6rem",
                }}
              >
                {isLoading ? "—" : count}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: color,
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-rajdhani"
                  style={{
                    fontSize: "0.7rem",
                    color: "#585b70",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* News grid */}
        {isLoading ? (
          <div style={{ columns: "1", gap: "1.25rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{ breakInside: "avoid", marginBottom: "1.25rem" }}
              >
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              minHeight: "20rem",
            }}
          >
            <div style={{ fontSize: "3rem", opacity: 0.2 }}>📭</div>
            <p
              className="font-orbitron"
              style={{
                fontSize: "0.75rem",
                color: "#45475a",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              No intel available
            </p>
          </div>
        ) : (
          <div style={{ columns: "320px", gap: "1.25rem" }}>
            {news.map((item) => (
              <div
                key={item.id}
                style={{ breakInside: "avoid", marginBottom: "1.25rem" }}
              >
                <NewsCard news={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
