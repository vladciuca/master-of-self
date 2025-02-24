const XP_COLORS = {
  positive: "lime-500",
  negative: "rose-500",
};

const JOURNAL_COLORS = {
  day: "yellow-500",
  dayHex: "#EAB308",
  night: "purple-500",
  nightHex: "#A855F7",
  sleep: "blue-500",
};

const HABIT_COLORS = {
  main: "teal-500",
  completed: XP_COLORS.positive,
  failed: XP_COLORS.negative,
  burnedOut: "orange-500",
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
  JOURNAL_COLORS,
  XP_COLORS,
  HABIT_COLORS,
  HABIT_TIER_COLORS,
  ERROR_COLOR,
};
