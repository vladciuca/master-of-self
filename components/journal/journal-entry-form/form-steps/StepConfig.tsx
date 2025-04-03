import { UseFormWatch } from "react-hook-form";

import { Bonus } from "./steps/bonus/Bonus";
import { Day } from "./steps/Day";
import { Night } from "./steps/Night";
import { Willpower } from "./steps/willpower/Willpower";
import { HabitActionsStep } from "./steps/HabitActionsStep";
import { isEvening } from "@lib/time";

import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import { Target, Shell } from "lucide-react";
import type { JournalEntry, JournalEntryCustomStep } from "@models/types";

// Define common field groups for consistent initialization
//NOTE: do we still need this?
export const DAY_FIELDS = ["day"];
export const NIGHT_FIELDS = ["night"];

type CreateStepsParams = {
  watch: UseFormWatch<JournalEntry>;
  userEveningTime: string;
  SHOW_ALL_TEST: boolean;
  customSteps: JournalEntryCustomStep[];
};

// What dose this function return exactly?
export function createSteps(params: CreateStepsParams) {
  const { watch, userEveningTime, SHOW_ALL_TEST, customSteps } = params;
  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  const day = watch("dayEntry.day") || [];

  const formSteps: JournalEntryCustomStep[] = [
    //=====DAY_ENTRY
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
      category: "other",
    },
    //=====ADD_DAY steps here
    ...customSteps
      .filter((step) => step.category === "day")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      })),
    //=====NIGHT_ENTRY
    {
      icon: <FaMoon />,
      type: "night",
      component: <Night />,
      isAvailable:
        SHOW_ALL_TEST || (isEvening(userEveningTime) && day?.length > 0),
      category: "other",
    },
    //=====ADD_NIGHT steps here
    ...customSteps
      .filter((step) => step.category === "night")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
      })),
    {
      icon: <FaBoltLightning />,
      type: "willpower",
      component: <Willpower />,
      isAvailable: SHOW_ALL_TEST || true, //NOTE: Not yet decided on behavior
      category: "other",
    },
    {
      icon: <Shell />,
      type: "habits",
      component: <HabitActionsStep />,
      isAvailable: SHOW_ALL_TEST || true, //NOTE: TEMP_ here we need to check if the user has habits
      category: "other",
    },
  ];

  return formSteps;
}

type CreteDefaultValuesParams = {
  journalEntryData?: JournalEntry;
  customSteps: JournalEntryCustomStep[];
};

export function creteFormDefaultValues(params: CreteDefaultValuesParams) {
  const { journalEntryData, customSteps } = params;

  const defaultValues: JournalEntry = {
    dailyWillpower: journalEntryData?.dailyWillpower ?? 0,
    bonusWillpower: journalEntryData?.bonusWillpower ?? 0,
    dayEntry: { day: [] },
    nightEntry: { night: [] },
    habits: journalEntryData?.habits ?? {},
  };

  // Add default values for built-in day fields
  if (journalEntryData?.dayEntry) {
    defaultValues.dayEntry = {
      ...defaultValues.dayEntry,
      ...journalEntryData.dayEntry,
    };
  } else {
    // Initialize with empty arrays for standard fields
    DAY_FIELDS.forEach((field) => {
      if (defaultValues.dayEntry) {
        defaultValues.dayEntry[field] = [];
      }
    });
  }

  // Add default values for built-in night fields
  if (journalEntryData?.nightEntry) {
    defaultValues.nightEntry = {
      ...defaultValues.nightEntry,
      ...journalEntryData.nightEntry,
    };
  } else {
    // Initialize with empty arrays for standard fields
    NIGHT_FIELDS.forEach((field) => {
      if (defaultValues.nightEntry) {
        defaultValues.nightEntry[field] = [];
      }
    });
  }

  // Add any custom fields from customSteps
  customSteps.forEach((step) => {
    if (step.category === "day" && defaultValues.dayEntry) {
      defaultValues.dayEntry[step.type] =
        journalEntryData?.dayEntry?.[step.type] || [];
    } else if (step.category === "night" && defaultValues.nightEntry) {
      defaultValues.nightEntry[step.type] =
        journalEntryData?.nightEntry?.[step.type] || [];
    }
  });

  return defaultValues;
}
