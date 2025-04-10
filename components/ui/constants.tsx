import React from "react";
import { FaSun, FaMoon, FaBoltLightning, FaStar } from "react-icons/fa6";
import {
  GiHealing,
  GiGuardedTower,
  GiAwareness,
  GiAura,
  GiInnerSelf,
} from "react-icons/gi";
import { JOURNAL_COLORS, HABIT_COLORS } from "@lib/colors";

//JOURNAL STEP ICONS
export type StepIconMap = {
  [key: string]: React.ReactElement;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun />,
  night: <FaMoon />,
  confidence: <GiAura />,
  awareness: <GiAwareness />,
  positivity: <GiHealing />,
  resilience: <GiGuardedTower />,
  willpower: <FaBoltLightning />,
  bonus: <FaStar />,
  default: <GiInnerSelf />,
};

//NOTE: WIP
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

export const journalStepStyle: { [key: string]: StepStyle } = {
  default: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  bonus: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  day: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  night: {
    bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
  },
  habits: {
    bgColor: `bg-${HABIT_COLORS.main}`,
  },
  dayEntry: {
    bgColor: `bg-${JOURNAL_COLORS.day}`,
  },
  nightEntry: {
    bgColor: `bg-${JOURNAL_COLORS.night}`,
  },
};

export const getJournalStepStyle = (stepType: string): StepStyle => {
  return journalStepStyle[stepType] || journalStepStyle.default;
};
