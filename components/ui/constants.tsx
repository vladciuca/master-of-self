import type React from "react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import {
  GiPrayer,
  GiBackup,
  GiPencilRuler,
  GiEnlightenment,
} from "react-icons/gi";

export const JOURNAL_COLORS = {
  day: "yellow-500",
  dayHex: "#EAB308",
  night: "purple-500",
  nightHex: "#A855F7",
  sleep: "blue-500",
  negative: "pink-500",
};

export type StepIconMap = {
  [key: string]: React.ReactNode;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiBackup size={"1.4rem"} />,
  actions: <GiPencilRuler size={"1.4rem"} />,
  default: <GiEnlightenment size={"1.7rem"} />,
};

export type StepStyle = {
  bgColor: string;
  textColor: string;
};

export const stepStyles: { [key: string]: StepStyle } = {
  day: {
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  night: {
    bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
    textColor: "text-purple-500",
  },
  gratitude: {
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  reflection: {
    bgColor: "bg-purple-500",
    textColor: "text-purple-500",
  },
  highlights: {
    bgColor: "bg-purple-500",
    textColor: "text-purple-500",
  },
  actions: {
    bgColor: "bg-teal-500",
    textColor: "text-pink-500",
  },
  default: {
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
};

// export const stepStyles: { [key: string]: StepStyle } = {
//   day: {
//     bgColor: `bg-${JOURNAL_COLORS.day}`,
//     textColor: `text-${JOURNAL_COLORS.day}`,
//   },
//   night: {
//     bgColor: `bg-[linear-gradient(to_right,_${JOURNAL_COLORS.dayHex}_50%,_${JOURNAL_COLORS.nightHex}_50%)]`,
//     textColor: `text-${JOURNAL_COLORS.night}`,
//   },
//   gratitude: {
//     bgColor: `bg-${JOURNAL_COLORS.day}`,
//     textColor: `text-${JOURNAL_COLORS.day}`,
//   },
//   reflection: {
//     bgColor: `bg-${JOURNAL_COLORS.night}`,
//     textColor: `text-${JOURNAL_COLORS.night}`,
//   },
//   highlights: {
//     bgColor: `bg-${JOURNAL_COLORS.night}`,
//     textColor: `text-${JOURNAL_COLORS.night}`,
//   },
//   actions: {
//     bgColor: `bg-${JOURNAL_COLORS.sleep}`,
//     textColor: `text-${JOURNAL_COLORS.negative}`,
//   },
//   default: {
//     bgColor: `bg-${JOURNAL_COLORS.day}`,
//     textColor: `text-${JOURNAL_COLORS.day}`,
//   },
// };

export const getStepStyle = (stepType: string): StepStyle => {
  return stepStyles[stepType] || stepStyles.default;
};
