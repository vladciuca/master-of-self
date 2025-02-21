import type React from "react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import {
  GiPrayer,
  GiPlayerTime,
  GiPencilRuler,
  GiEnlightenment,
} from "react-icons/gi";

export type StepIconMap = {
  [key: string]: React.ReactNode;
};

export const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiPlayerTime size={"1.6rem"} />,
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
    bgColor: "bg-pink-500",
    textColor: "text-pink-500",
  },
  default: {
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
};

export const getStepStyle = (stepType: string): StepStyle => {
  return stepStyles[stepType] || stepStyles.default;
};

export const journalColors = {
  day: "yellow-500",
  night: "purple-500",
  sleep: "blue-500",
  negative: "pink-500",
};
