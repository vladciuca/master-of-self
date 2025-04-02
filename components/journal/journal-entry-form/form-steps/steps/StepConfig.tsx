import { Bonus } from "./bonus/Bonus";
import { Day } from "./Day";
import { Night } from "./Night";
import { Willpower } from "./willpower/Willpower";
import { HabitActionsStep } from "./HabitActionsStep";
import { isEvening } from "@lib/time";

import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import { Target, Shell } from "lucide-react";
import type { JournalEntryCustomStep } from "@models/types";

// Function to create the built-in steps
export function createBuiltInSteps(
  watch: any,
  userEveningTime: string,
  availableSteps: Record<string, boolean>,
  SHOW_ALL_TEST = false
): JournalEntryCustomStep[] {
  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  const day = watch("dayEntry.day") || [];

  return [
    // DAY ENTRY
    //POSITION 1
    {
      icon: <FaStar />,
      type: "bonus",
      component: <Bonus />,
      isAvailable:
        SHOW_ALL_TEST ||
        (!isEvening(userEveningTime) && watch("bonusWillpower") > 0),
      category: "other",
    },
    //POSITION 2
    {
      icon: <FaSun />,
      type: "day",
      component: <Day />,
      isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      category: "other",
    },
    //NIGHT ENTRY
    //POSITION 1
    {
      icon: <FaMoon />,
      type: "night",
      component: <Night />,
      isAvailable:
        SHOW_ALL_TEST || (isEvening(userEveningTime) && day?.length > 0),
      category: "other",
    },
    //NOTE: here must add night steps

    //ALWAYS AVAILABLE
    //POSITION LAST
    {
      icon: <FaBoltLightning />,
      type: "willpower",
      component: <Willpower />,
      isAvailable: true,
      category: "other",
    },
    //POSITION LAST +1
    {
      icon: <Shell />,
      type: "habits",
      component: <HabitActionsStep />,
      isAvailable: availableSteps.habits ?? false,
      category: "other",
    },
  ];
}
