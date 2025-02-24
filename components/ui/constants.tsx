import type React from "react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import {
  GiPrayer,
  GiBackup,
  // GiPlayerTime, // might be used for REFLECTION STEP in JOURNAL-REFACTOR
  // GiAura,
  GiPencilRuler,
  GiEnlightenment,
} from "react-icons/gi";
import colors from "../../lib/colors";

// export const JOURNAL_COLORS = {
//   day: "yellow-500",
//   dayHex: "#EAB308",
//   night: "purple-500",
//   nightHex: "#A855F7",
//   sleep: "blue-500",
// };

// export const XP_COLORS = {
//   positive: "lime-500",
//   negative: "rose-500",
// };

// export const HABIT_COLORS = {
//   main: "teal-500",
//   completed: XP_COLORS.positive,
//   failed: XP_COLORS.negative,
//   burnedOut: "orange-500",
// };

// export const ERROR_COLOR = "red-500";

export const JOURNAL_COLORS = colors.JOURNAL_COLORS;
export const XP_COLORS = colors.XP_COLORS;
export const HABIT_COLORS = colors.HABIT_COLORS;
export const ERROR_COLOR = colors.ERROR_COLOR;

export type StepIconMap = {
  [key: string]: React.ReactNode;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  // affirmations: <GiAura />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiBackup size={"1.4rem"} />,
  actions: <GiPencilRuler size={"1.4rem"} />,
  default: <GiEnlightenment size={"1.7rem"} />,
};

export type StepStyle = {
  bgColor: string;
};

//NOTE* Steps will need to be renamed and refactor in JOURNAL-REFACTOR
export const stepStyles: { [key: string]: StepStyle } = {
  // CONDITIONAL STEP: active if Night entries form yesterday's journal exist
  // NOTE* This fallback is for the reward step
  // RENAME: Rewards(Bonus Willpower) Step
  default: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  // DAY STEP
  // Gratitude: +positivity points
  gratitude: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  // DAY STEP
  // RENAME: Daily Panning: +motivation points
  day: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  // DAY STEP
  // Affirmations Step: +confidence points
  // NOTE* Will be implemented in JOURNAL-REFACTOR
  // affirmations: {
  //   bgColor: `bg-${JOURNAL_COLORS.day}`,
  // },
  // NIGHT STEP
  // NOTE* will probably be removed in JOURNAL-REFACTOR
  // NOTE* right now it is a check list to complete for the current "day" step
  night: {
    bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
    // bgColor: `bg-[linear-gradient(to_right,_${JOURNAL_COLORS.dayHex}_50%,_${JOURNAL_COLORS.nightHex}_50%)]`,
    // TO RETARDED TO INTEGRATE THIS AND I do not want to create a Tailwind theme extension for this that it might even be removed
    // tailwind.config.js
    // const colors = require("./lib/colors");

    // module.exports = {
    //   // ... other config
    //   safelist: [
    //     // ... other patterns
    //     {
    //       pattern: /^bg-\[.*\]$/,
    //       variants: ['hover', 'focus', 'active'],
    //     }
    //   ],
    //   theme: {
    //     extend: {
    //       backgroundImage: {
    //         'night-gradient': `linear-gradient(to right, ${colors.JOURNAL_COLORS.dayHex} 50%, ${colors.JOURNAL_COLORS.nightHex} 50%)`,
    //       },
    //     },
    //   },
    //   // ... other config
    // };
  },
  // NIGHT STEP
  // Highlights(Treasure Hunt): +awareness points
  highlights: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  // NIGHT STEP
  // Reflection: +growth points
  reflection: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  // CONDITIONAL STEP: active if habits exist
  // RENAME: Habits - in HABIT-REFACTOR
  actions: {
    bgColor: `bg-${HABIT_COLORS.main}`,
  },
};

export const getStepStyle = (stepType: string): StepStyle => {
  return stepStyles[stepType] || stepStyles.default;
};
