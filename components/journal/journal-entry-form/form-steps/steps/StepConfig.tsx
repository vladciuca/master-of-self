import { Bonus } from "./bonus/Bonus";
import { Day } from "./Day";
import { Night } from "./Night";
import { Willpower } from "./willpower/Willpower";
import { HabitActionsStep } from "./HabitActionsStep";
import { isEvening } from "@lib/time";

import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import { Target, Shell } from "lucide-react";
import type { JournalEntry, JournalEntryCustomStep } from "@models/types";
import { UseFormWatch } from "react-hook-form";

// Define common field groups for consistent initialization
export const DAY_FIELDS = ["day"];
export const NIGHT_FIELDS = ["night"];

type CreateStepsParams = {
  //   watch: (field: string) => any; //this is a function but what dose it return?
  watch: UseFormWatch<JournalEntry>;
  userEveningTime: string;
  availableSteps: Record<string, boolean>; //this will need to be moved some where else?!
  SHOW_ALL_TEST: boolean;
  customSteps: JournalEntryCustomStep[];
};

// What dose this function return exactly?
export function createSteps(params: CreateStepsParams) {
  const { watch, userEveningTime, availableSteps, SHOW_ALL_TEST, customSteps } =
    params;
  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  const day = watch("dayEntry.day") || [];

  const formSteps: JournalEntryCustomStep[] = [
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
    //=====ADD DAY steps here
    ...customSteps
      .filter((step) => step.category === "day")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      })), // Insert day steps here with isAvailable logic
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
    //=====ADD NIGHT steps here
    ...customSteps
      .filter((step) => step.category === "night")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
      })), // Insert night steps here with isAvailable logic
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

  return formSteps;
}
