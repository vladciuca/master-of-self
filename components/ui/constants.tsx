import React from "react";
import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import {
  GiHealing,
  // GiPlayerTime, // might be used for REFLECTION STEP in JOURNAL-REFACTOR
  GiBackup,
  GiGuardedTower,
  GiBeamsAura,
  GiPsychicWaves,
  GiAwareness,
  GiAura,
  GiPencilRuler,
  GiEnlightenment,
  GiHazardSign,
  GiSun,
  GiSpellBook,
  GiDeadlyStrike,
} from "react-icons/gi";
import { JOURNAL_COLORS, HABIT_COLORS } from "@lib/colors";

//JOURNAL STEP ICONS
export type StepIconMap = {
  [key: string]: React.ReactNode;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun />,
  night: <FaMoon />,
  affirmations: <GiAura />,
  highlights: <GiAwareness />,
  gratitude: <GiHealing />,
  reflection: <GiGuardedTower />,
  habits: <GiPencilRuler />,
  bonus: <GiEnlightenment />,
  willpower: <FaBoltLightning />,
  default: <GiHazardSign />,
};

export type StepDisciplines = {
  [key: string]: string;
};

export const stepDisciplines: StepDisciplines = {
  gratitude: "Positivity",
  day: "Motivation",
  affirmations: "Confidence",
  highlights: "Awareness",
  reflection: "Resilience",
};

//JOURNAL STEPS STYLE
export type StepStyle = {
  bgColor: string;
};

export const stepStyles: { [key: string]: StepStyle } = {
  default: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  bonus: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  gratitude: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  affirmations: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  day: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
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
  highlights: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  reflection: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
  habits: {
    bgColor: `bg-${HABIT_COLORS.main}`,
  },
};

export const getStepStyle = (stepType: string): StepStyle => {
  return stepStyles[stepType] || stepStyles.default;
};
