import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type React from "react";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumberSuffixes(number: number): string {
  if (number < 1000) {
    return number.toString();
  }

  const suffixes: string[] = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    suffixIndex++;
    number /= 1000;
  }

  return `${number.toFixed(1).replace(/\.0$/, "")}${suffixes[suffixIndex]}`;
}

// --- Runtime color helpers (for practice colors from the database) ---

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

  if (color === "primary") {
    return { className: `${prefix}-primary` };
  }

  const normalized = normalizeLegacyColor(color);

  if (isHexColor(normalized)) {
    return { style: { [styleProp]: normalized } };
  }

  if (normalized.includes("-")) {
    return { className: `${prefix}-${normalized}` };
  }

  return {};
}
