"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type ToastType = "error" | "success" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface AchievementToast {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const TOAST_STYLES: Record<
  ToastType,
  { border: string; bg: string; color: string; icon: string }
> = {
  error: {
    border: "#f38ba8",
    bg: "rgba(243,139,168,0.08)",
    color: "#f38ba8",
    icon: "✕",
  },
  success: {
    border: "#a6e3a1",
    bg: "rgba(166,227,161,0.08)",
    color: "#a6e3a1",
    icon: "✓",
  },
  warning: {
    border: "#f9e2af",
    bg: "rgba(249,226,175,0.08)",
    color: "#f9e2af",
    icon: "⚠",
  },
  info: {
    border: "#00f5ff",
    bg: "rgba(0,245,255,0.08)",
    color: "#00f5ff",
    icon: "ℹ",
  },
};

let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;
let addAchievementFn: ((a: Omit<AchievementToast, "id">) => void) | null = null;

export function toast(type: ToastType, title: string, message?: string) {
  addToastFn?.({ type, title, message });
}

export function achievementToast(
  title: string,
  description: string,
  icon: string,
) {
  addAchievementFn?.({ title, description, icon });
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [achievements, setAchievements] = useState<AchievementToast[]>([]);

  useEffect(() => {
    addToastFn = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((x) => x.id !== id)),
        4000,
      );
    };
    addAchievementFn = (a) => {
      const id = Math.random().toString(36).slice(2);

      //Play Sound
      const audio = new Audio('/sounds/achievement.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
      setAchievements((prev) => [...prev, { ...a, id }]);
      setTimeout(
        () => setAchievements((prev) => prev.filter((x) => x.id !== id)),
        6000,
      );
    };
    return () => {
      addToastFn = null;
      addAchievementFn = null;
    };
  }, []);

  return (
    <>
      {/* Regular toasts — bottom right */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const s = TOAST_STYLES[t.type];
          return (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                minWidth: "18rem",
                maxWidth: "22rem",
                padding: "0.85rem 1.1rem",
                borderRadius: "14px",
                background: "rgba(17,17,27,0.92)",
                border: `1px solid ${s.border}40`,
                backdropFilter: "blur(16px)",
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${s.border}18`,
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                animation: "toast-in 0.22s ease",
              }}
            >
              <div
                style={{
                  width: "1.6rem",
                  height: "1.6rem",
                  borderRadius: "8px",
                  flexShrink: 0,
                  background: s.bg,
                  border: `1px solid ${s.border}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: s.color,
                  fontWeight: 700,
                }}
              >
                {s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Orbitron",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: s.color,
                    marginBottom: t.message ? "0.2rem" : 0,
                  }}
                >
                  {t.title}
                </div>
                {t.message && (
                  <div
                    style={{
                      fontFamily: "Rajdhani",
                      fontSize: "0.85rem",
                      color: "var(--text-overlay1)",
                      lineHeight: 1.4,
                    }}
                  >
                    {t.message}
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((x) => x.id !== t.id))
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-overlay2)",
                  fontSize: "0.75rem",
                  padding: "0.1rem",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Achievement popups — bottom left, Steam-style */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          pointerEvents: "none",
        }}
      >
        {achievements.map((a) => (
          <div
            key={a.id}
            style={{
              pointerEvents: "auto",
              width: "22rem",
              display: "flex",
              alignItems: "stretch",
              borderRadius: "6px",
              overflow: "hidden",
              animation:
                "achievement-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,226,175,0.15)",
            }}
          >
            {/* Gold left bar */}
            <div
              style={{
                width: "4px",
                background: "linear-gradient(180deg, #f9e2af, #fab387)",
                flexShrink: 0,
              }}
            />

            {/* Dark background panel */}
            <div
              style={{
                flex: 1,
                background:
                  "linear-gradient(135deg, rgba(22,20,40,0.98), rgba(17,17,27,0.98))",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(249,226,175,0.12)",
                borderRight: "1px solid rgba(249,226,175,0.12)",
                borderBottom: "1px solid rgba(249,226,175,0.12)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
              }}
            >
              {/* Icon box */}
              <div
                style={{
                  width: "3.25rem",
                  height: "3.25rem",
                  flexShrink: 0,
                  borderRadius: "6px",
                  background:
                    "linear-gradient(135deg, rgba(249,226,175,0.15), rgba(250,179,135,0.08))",
                  border: "1px solid rgba(249,226,175,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow:
                    "0 0 20px rgba(249,226,175,0.15), inset 0 1px 0 rgba(249,226,175,0.1)",
                }}
              >
                {a.icon?.endsWith(".png") ||
                a.icon?.endsWith(".webp") ||
                a.icon?.startsWith("/") ? (
                  <Image
                    src={a.icon}
                    alt={a.title}
                    width={52}
                    height={52}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "1.6rem" }}>{a.icon}</span>
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Orbitron",
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#f9e2af",
                    marginBottom: "0.2rem",
                    opacity: 0.8,
                  }}
                >
                  Achievement Unlocked
                </div>
                <div
                  style={{
                    fontFamily: "Orbitron",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#cdd6f4",
                    letterSpacing: "0.04em",
                    marginBottom: "0.25rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {a.title}
                </div>
                <div
                  style={{
                    fontFamily: "Rajdhani",
                    fontSize: "0.8rem",
                    color: "#7f849c",
                    lineHeight: 1.35,
                  }}
                >
                  {a.description}
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={() =>
                  setAchievements((prev) => prev.filter((x) => x.id !== a.id))
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#45475a",
                  fontSize: "0.7rem",
                  padding: "0.15rem",
                  lineHeight: 1,
                  flexShrink: 0,
                  alignSelf: "flex-start",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
