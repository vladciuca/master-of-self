import React from "react";
import { Target, Shell } from "lucide-react";
import { FaSun, FaMoon, FaBoltLightning, FaStar } from "react-icons/fa6";
import {
  GiHealing,
  GiGuardedTower,
  GiAwareness,
  GiAura,
  GiInnerSelf,
  GiNightSleep,
  GiPencilRuler,
} from "react-icons/gi";
import { JOURNAL_COLORS, HABIT_COLORS } from "@lib/colors";

//ICONS
export type StepIconMap = {
  [key: string]: React.ReactElement;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun />,
  night: <FaMoon />,
  sleep: <GiNightSleep />,
  //Built-in step icons
  habits: <GiPencilRuler />,
  goals: <Target />,
  confidence: <GiAura />,
  awareness: <GiAwareness />,
  positivity: <GiHealing />,
  resilience: <GiGuardedTower />,
  willpower: <FaBoltLightning />,
  bonus: <FaStar />,
  default: <GiInnerSelf />,
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

export function getTimePeriodIconAndColor(
  timePeriod: "day" | "night" | "sleep"
) {
  switch (timePeriod) {
    case "day":
      return {
        periodColor: JOURNAL_COLORS.day,
        IconElement: stepIconMap.day,
      };
    case "night":
      return {
        periodColor: JOURNAL_COLORS.night,
        IconElement: stepIconMap.night,
      };
    default: // 'sleep'
      return {
        periodColor: JOURNAL_COLORS.sleep,
        IconElement: stepIconMap.sleep,
      };
  }
}
