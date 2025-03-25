const XP_COLORS = {
  positive: "lime-500",
  negative: "rose-500",
};

const XP_HEX_COLORS = {
  positiveHex: "#84CC16",
  negativeHex: "#F43F5E",
};

const JOURNAL_COLORS = {
  day: "yellow-500",
  night: "purple-500",
  sleep: "blue-500",
  score: "green-500",
};

const JOURNAL_HEX_COLORS = {
  dayHex: "#EAB308",
  nightHex: "#A855F7",
  sleepHex: "#3b82f6",
  scoreHex: "#22c55e",
};

const HABIT_COLORS = {
  main: "teal-500",
  completed: XP_COLORS.positive,
  failed: XP_COLORS.negative,
  burnedOut: "orange-500",
};

const HABIT_HEX_COLORS = {
  mainHex: "#14B8A6",
  completedHex: XP_HEX_COLORS.positiveHex,
  failedHex: XP_HEX_COLORS.negativeHex,
  burnedOutHex: "#f97316",
};

const HABIT_TIER_COLORS = {
  common: {
    foreground: "neutral-500",
    background: "neutral-200",
  },
  uncommon: {
    foreground: "emerald-500",
    background: "emerald-200",
  },
  rare: {
    foreground: "blue-500",
    background: "blue-200",
  },
  epic: {
    foreground: "violet-500",
    background: "violet-200",
  },
  legendary: {
    foreground: "red-400",
    background: "red-100",
  },
  transcendent: {
    foreground: "fuchsia-500",
    background: "fuchsia-200",
  },
};

const ERROR_COLOR = "red-500";

module.exports = {
  XP_COLORS,
  XP_HEX_COLORS,
  JOURNAL_COLORS,
  JOURNAL_HEX_COLORS,
  HABIT_COLORS,
  HABIT_HEX_COLORS,
  HABIT_TIER_COLORS,
  ERROR_COLOR,
};
