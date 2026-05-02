"use client";

import { useState } from "react";
import { createCoin } from "../action";
import { CreateCoinParams } from "../type";
import { toast } from "@/components/toaster";

interface CoinFormData {
  symbol: string;
  name: string;
  initialPrice: string;
  maxSupply: string;
  description: string;
  color: string;
  category: "meme" | "ai" | "game";
}

const COLOR_PRESETS = [
  "#00f5ff",
  "#cba6f7",
  "#a6e3a1",
  "#f38ba8",
  "#fab387",
  "#f9e2af",
  "#89dceb",
];

const CATEGORIES: {
  value: CoinFormData["category"];
  label: string;
  icon: string;
  desc: string;
  color: string;
  volatility: number;
}[] = [
  {
    value: "meme",
    label: "Meme",
    icon: "🐸",
    desc: "Most volatile",
    color: "#f38ba8",
    volatility: 3,
  },
  {
    value: "ai",
    label: "AI",
    icon: "🤖",
    desc: "Mid volatility",
    color: "#cba6f7",
    volatility: 2,
  },
  {
    value: "game",
    label: "Game",
    icon: "🎮",
    desc: "Most stable",
    color: "#a6e3a1",
    volatility: 1,
  },
];

interface Props {
  onCreated?: () => void;
}

export default function CreateCoinForm({ onCreated }: Props) {
  const [form, setForm] = useState<CoinFormData>({
    symbol: "",
    name: "",
    initialPrice: "",
    maxSupply: "",
    description: "",
    color: "#00f5ff",
    category: "ai",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {

      if (!form.symbol || !form.name || !form.initialPrice) return;
      setLoading(true);
      const data: CreateCoinParams = {
        category: form.category,
        color: form.color,
        description: form.description,
        initialPrice: form.initialPrice,
        maxSupply: form.maxSupply,
        name: form.name,
        symbol: form.symbol,
      };
      const res = await createCoin(JSON.stringify(data));
      if(!res.success) {
        setSuccess(false);
        throw new Error(res.error);
      } else {
        setSuccess(true);
        onCreated?.();
      }
    } catch (err) {
        if (err?.message?.includes('symbol')) {
          toast('error', 'Duplicate Symbol', `A coin with symbol "${form.symbol.toUpperCase()}" already exists.`);
        } else if (err?.message?.includes('name')) {
          toast('error', 'Duplicate Name', `A coin named "${form.name}" already exists.`);
        } else {
          toast('error', 'Creation Failed', err?.message ?? 'Something went wrong. Please try again.');
        }

    } finally {

      setLoading(false);
      setForm({
        symbol: "",
        name: "",
        initialPrice: "",
        maxSupply: "",
        description: "",
        color: "#00f5ff",
        category: "ai",
      });
      setSuccess(false);
    }
  };

  const set =
    (k: keyof CoinFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const selectedCategory = CATEGORIES.find((c) => c.value === form.category)!;

  return (
    <>
      <div className="nx-section-title">+ Create New Coin</div>

      {/* Symbol + Name */}
      <div className="nx-form-grid">
        <div className="nx-field">
          <label className="nx-label">
            Symbol <span style={{ color: "#f38ba8" }}>*</span>
          </label>
          <input
            value={form.symbol}
            onChange={set("symbol")}
            placeholder="NXC"
            maxLength={5}
            className="nx-input"
            style={{ textTransform: "uppercase" }}
          />
        </div>
        <div className="nx-field">
          <label className="nx-label">
            Name <span style={{ color: "#f38ba8" }}>*</span>
          </label>
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="NexusCoin"
            className="nx-input"
          />
        </div>
      </div>

      {/* Price + Supply */}
      <div className="nx-form-grid">
        <div className="nx-field">
          <label className="nx-label">
            Initial Price (USD) <span style={{ color: "#f38ba8" }}>*</span>
          </label>
          <input
            value={form.initialPrice}
            onChange={set("initialPrice")}
            placeholder="1000.00"
            type="number"
            min={0}
            className="nx-input appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
        </div>
        <div className="nx-field">
          <label className="nx-label">Max Supply</label>
          <input
            value={form.maxSupply}
            onChange={set("maxSupply")}
            placeholder="21000000"
            type="number"
            min={0}
            className="nx-input appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
        </div>
      </div>

      {/* Category */}
      <div className="nx-field">
        <label className="nx-label">
          Category <span style={{ color: "#f38ba8" }}>*</span>
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.6rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setForm((p) => ({ ...p, category: cat.value }))}
              style={{
                padding: "0.75rem 0.5rem",
                borderRadius: "12px",
                border: `1px solid ${form.category === cat.value ? cat.color + "60" : "rgba(180,190,254,0.1)"}`,
                background:
                  form.category === cat.value
                    ? `${cat.color}12`
                    : "rgba(17,17,27,0.6)",
                color:
                  form.category === cat.value
                    ? cat.color
                    : "var(--text-overlay1)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                transition: "all 0.18s",
                boxShadow:
                  form.category === cat.value
                    ? `0 0 12px ${cat.color}22`
                    : "none",
              }}
            >
              <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                {cat.icon}
              </span>
              <span
                style={{
                  fontFamily: "Orbitron",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {cat.label}
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani",
                  fontSize: "0.65rem",
                  color:
                    form.category === cat.value
                      ? cat.color + "cc"
                      : "var(--text-overlay2)",
                  letterSpacing: "0.04em",
                }}
              >
                {cat.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Volatility bar */}
        <div
          style={{
            marginTop: "0.65rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "Rajdhani",
              fontSize: "0.65rem",
              color: "var(--text-overlay2)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            Volatility
          </span>
          <div
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "999px",
              background: "rgba(180,190,254,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(selectedCategory.volatility / 3) * 100}%`,
                borderRadius: "999px",
                background: selectedCategory.color,
                boxShadow: `0 0 8px ${selectedCategory.color}88`,
                transition: "all 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "Share Tech Mono",
              fontSize: "0.65rem",
              color: selectedCategory.color,
              flexShrink: 0,
              minWidth: "2.5rem",
              textAlign: "right",
            }}
          >
            {selectedCategory.volatility === 3
              ? "HIGH"
              : selectedCategory.volatility === 2
                ? "MED"
                : "LOW"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="nx-field">
        <label className="nx-label">Description</label>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder="Describe this coin..."
          className="nx-input"
        />
      </div>

      {/* Color picker */}
      <div className="nx-field">
        <label className="nx-label">Coin Color</label>
        <div className="nx-colors">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setForm((p) => ({ ...p, color: c }))}
              className={`nx-color-swatch${form.color === c ? " active" : ""}`}
              style={{
                background: c,
                boxShadow: form.color === c ? `0 0 14px ${c}99` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Live preview */}
      {form.symbol && (
        <div className="nx-preview">
          <div
            className="nx-preview-badge"
            style={{
              background: `${form.color}18`,
              color: form.color,
              border: `1px solid ${form.color}33`,
            }}
          >
            {form.symbol.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  fontFamily: "Orbitron",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: form.color,
                }}
              >
                {form.symbol.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "1px 7px",
                  borderRadius: "999px",
                  background: `${selectedCategory.color}18`,
                  border: `1px solid ${selectedCategory.color}40`,
                  color: selectedCategory.color,
                }}
              >
                {selectedCategory.icon} {selectedCategory.label}
              </span>
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--text-overlay2)",
                marginTop: "2px",
              }}
            >
              {form.name || "Unnamed"}
            </div>
          </div>
          <div className="nx-preview-price">
            ${parseFloat(form.initialPrice || "0").toLocaleString()}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.symbol || !form.name || !form.initialPrice}
        className={success ? "nx-btn-primary nx-btn-success" : "nx-btn-primary"}
      >
        {loading ? (
          <>
            <span className="nx-spinner" />
            Creating...
          </>
        ) : success ? (
          "✓ Coin Created!"
        ) : (
          "Create Coin"
        )}
      </button>
    </>
  );
}
