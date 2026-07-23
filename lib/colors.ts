export const XP_COLORS = {
  positive: "xp-positive",
  negative: "xp-negative",
};

export const XP_HEX_COLORS = {
  positiveHex: "#84CC16",
  negativeHex: "#F43F5E",
};

export const JOURNAL_COLORS = {
  day: "journal-day",
  night: "journal-night",
  sleep: "journal-sleep",
  score: "journal-score",
};

export const JOURNAL_HEX_COLORS = {
  dayHex: "#EAB308",
  nightHex: "#A855F7",
  sleepHex: "#3b82f6",
  scoreHex: "#22c55e",
};

export const DISCIPLINE_COLORS = {
  slate: "#64748b",
  stone: "#78716c",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#fde047",
  lime: "#84cc16",
  emerald: "#059669",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#c084fc",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
};

export const HABIT_COLORS = {
  main: "habit-main",
  completed: XP_COLORS.positive,
  failed: XP_COLORS.negative,
  burnedOut: "habit-burned-out",
};

export const HABIT_HEX_COLORS = {
  mainHex: "#14B8A6",
  completedHex: XP_HEX_COLORS.positiveHex,
  failedHex: XP_HEX_COLORS.negativeHex,
  burnedOutHex: "#f97316",
};

export const HABIT_TIER_COLORS = {
  common: {
    foreground: "habit-tier-common-fg",
    background: "habit-tier-common-bg",
  },
  uncommon: {
    foreground: "habit-tier-uncommon-fg",
    background: "habit-tier-uncommon-bg",
  },
  rare: {
    foreground: "habit-tier-rare-fg",
    background: "habit-tier-rare-bg",
  },
  epic: {
    foreground: "habit-tier-epic-fg",
    background: "habit-tier-epic-bg",
  },
  legendary: {
    foreground: "habit-tier-legendary-fg",
    background: "habit-tier-legendary-bg",
  },
  transcendent: {
    foreground: "habit-tier-transcendent-fg",
    background: "habit-tier-transcendent-bg",
  },
};

export const ERROR_COLOR = "error";

import type React from "react";

const TAILWIND_COLOR_MAP: Record<string, string> = {
  "slate-500": "#64748b",
  "stone-500": "#78716c",
  "red-500": "#ef4444",
  "orange-500": "#f97316",
  "amber-500": "#f59e0b",
  "yellow-300": "#fde047",
  "yellow-500": "#eab308",
  "lime-500": "#84cc16",
  "emerald-600": "#059669",
  "emerald-500": "#10b981",
  "teal-500": "#14b8a6",
  "cyan-500": "#06b6d4",
  "sky-500": "#0ea5e9",
  "blue-500": "#3b82f6",
  "indigo-500": "#6366f1",
  "violet-500": "#8b5cf6",
  "purple-400": "#c084fc",
  "purple-500": "#a855f7",
  "fuchsia-500": "#d946ef",
  "pink-500": "#ec4899",
  "rose-500": "#f43f5e",
  "neutral-500": "#737373",
  "neutral-200": "#e5e5e5",
  "red-400": "#f87171",
  "red-100": "#fee2e2",
};

export function normalizeLegacyColor(
  color: string | null | undefined
): string {
  if (!color) return "";
  if (color.startsWith("#")) return color;
  if (color === "primary") return "primary";
  return TAILWIND_COLOR_MAP[color] || color;
}

export function isHexColor(value: string | null | undefined): boolean {
  return !!value && /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function getRuntimeColorProps(
  color: string | null | undefined,
  type: "text" | "bg" | "border" = "text"
): {
  className?: string;
  style?: React.CSSProperties;
} {
  if (!color) return {};

  const prefix =
    type === "text" ? "text" : type === "bg" ? "bg" : "border";
  const styleProp =
    type === "text"
      ? "color"
      : type === "bg"
        ? "backgroundColor"
        : "borderColor";

  // Special semantic token that is already a valid Tailwind class.
  if (color === "primary") {
    return { className: `${prefix}-primary` };
  }

  // Normalize legacy Tailwind class fragments (e.g. "red-500") to hex values.
  const normalized = normalizeLegacyColor(color);

  if (isHexColor(normalized)) {
    return { style: { [styleProp]: normalized } };
  }

  // If it looks like a semantic token (contains a dash), use it as a class.
  if (normalized.includes("-")) {
    return { className: `${prefix}-${normalized}` };
  }

  return {};
}
