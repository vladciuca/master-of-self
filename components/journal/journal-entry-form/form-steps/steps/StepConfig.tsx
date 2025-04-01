import { Bonus } from "./bonus/Bonus";
import { Day } from "./Day";
import { Night } from "./Night";
import { Willpower } from "./willpower/Willpower";
import { HabitActionsStep } from "./HabitActionsStep";
import { isEvening } from "@lib/time";

import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import { Target, Shell } from "lucide-react";

export type FormStep = {
  icon: React.ReactNode;
  type: string;
  component: React.ReactNode;
  isAvailable: boolean;
  category: "day" | "night" | "other";
};

// Function to create the built-in steps
export function createBuiltInSteps(
  watch: any,
  userEveningTime: string,
  availableSteps: Record<string, boolean>,
  SHOW_ALL_TEST = false
): FormStep[] {
  const day = watch("dayEntry.day") || [];

  return [
    {
      icon: <FaStar />,
      type: "bonus",
      component: <Bonus />,
      isAvailable:
        SHOW_ALL_TEST ||
        (!isEvening(userEveningTime) && watch("bonusWillpower") > 0),
      category: "other",
    },
    {
      icon: <FaSun />,
      type: "day",
      component: <Day />,
      isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      category: "day",
    },
    {
      icon: <FaMoon />,
      type: "night",
      component: <Night />,
      isAvailable:
        SHOW_ALL_TEST || (isEvening(userEveningTime) && day?.length > 0),
      category: "night",
    },
    {
      icon: <FaBoltLightning />,
      type: "willpower",
      component: <Willpower />,
      isAvailable: true,
      category: "other",
    },
    {
      icon: <Shell />,
      type: "habits",
      component: <HabitActionsStep />,
      isAvailable: availableSteps.habits ?? false,
      category: "other",
    },
  ];
}
