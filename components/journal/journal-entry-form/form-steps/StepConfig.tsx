import { UseFormWatch } from "react-hook-form";

import { Bonus } from "./steps/bonus/Bonus";
import { Day } from "./steps/Day";
import { Night } from "./steps/Night";
import { Willpower } from "./steps/willpower/Willpower";
import { HabitActionsStep } from "./steps/HabitActionsStep";
import { stepIconMap } from "@components/ui/constants";
//NOTE: need to check how to use getCurrentTimePeriod() here
import { isEvening } from "@lib/time";
import { calculateHabitsXpFromEntry } from "@lib/level";
import type {
  JournalEntry,
  JournalCustomStep,
  JournalStepType,
} from "@models/types";

// Define common field groups for consistent initialization
//NOTE: Might we need this in the future to add more standard steps?
// export const DAY_FIELDS = ["day"];
// export const NIGHT_FIELDS = ["night"];

//NOTE: Creates a complete array of form steps by combining built-in and custom steps
type CreateStepsParams = {
  watch: UseFormWatch<JournalEntry>;
  now: Date;
  userEveningTime: string;
  SHOW_ALL_TEST: boolean;
  customSteps: JournalCustomStep[];
  hasHabits: boolean;
};

export function createSteps(params: CreateStepsParams): JournalCustomStep[] {
  const { watch, now, userEveningTime, SHOW_ALL_TEST, customSteps, hasHabits } =
    params;

  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  const day = watch("dayEntry.day") || [];

  const formSteps: JournalCustomStep[] = [
    //=====DAY_ENTRY
    {
      _id: "bonus",
      icon: stepIconMap.bonus,
      type: "other",
      discipline: "bonus",
      component: <Bonus />,
      isAvailable:
        SHOW_ALL_TEST ||
        (!isEvening(userEveningTime, now) && watch("bonusWillpower") > 0),
    },
    {
      _id: "day",
      icon: stepIconMap.day,
      discipline: "day",
      component: <Day />,
      isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime, now),
      type: "other",
    },
    //=====ADD_DAY steps here
    ...customSteps
      .filter((step) => step.type === "dayEntry")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime, now),
      })),
    //=====NIGHT_ENTRY
    {
      _id: "night",
      icon: stepIconMap.night,
      discipline: "night",
      component: <Night />,
      isAvailable:
        SHOW_ALL_TEST || (isEvening(userEveningTime, now) && day?.length > 0),
      type: "other",
    },
    //=====ADD_NIGHT steps here
    ...customSteps
      .filter((step) => step.type === "nightEntry")
      .map((step) => ({
        ...step,
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime, now),
      })),
    {
      _id: "willpower",
      icon: stepIconMap.willpower,
      discipline: "willpower",
      component: <Willpower />,
      isAvailable: SHOW_ALL_TEST || true, //NOTE: Not yet decided on behavior
      type: "other",
    },
    {
      _id: "habits",
      icon: stepIconMap.habits,
      discipline: "habits",
      component: <HabitActionsStep />,
      isAvailable: SHOW_ALL_TEST || hasHabits,
      type: "other",
    },
  ];

  return formSteps;
}

//NOTE: Helper function to create initial form values structure
type CreteDefaultValuesParams = {
  journalEntryData?: JournalEntry;
  customSteps: JournalCustomStep[];
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
    // DAY_FIELDS.forEach((field) => {
    //   if (defaultValues.dayEntry) {
    //     defaultValues.dayEntry[field] = [];
    //   }
    // });
    if (defaultValues.dayEntry) {
      defaultValues.dayEntry.day = [];
    }
  }

  // Add default values for built-in night fields
  if (journalEntryData?.nightEntry) {
    defaultValues.nightEntry = {
      ...defaultValues.nightEntry,
      ...journalEntryData.nightEntry,
    };
  } else {
    // Initialize with empty arrays for standard fields
    // NIGHT_FIELDS.forEach((field) => {
    //   if (defaultValues.nightEntry) {
    //     defaultValues.nightEntry[field] = [];
    //   }
    // });
    if (defaultValues.nightEntry) {
      defaultValues.nightEntry.night = [];
    }
  }

  // Add any custom fields from customSteps
  customSteps.forEach((step) => {
    if (step.type === "dayEntry" && defaultValues.dayEntry) {
      defaultValues.dayEntry[String(step._id)] =
        journalEntryData?.dayEntry?.[String(step._id)] || [];
    } else if (step.type === "nightEntry" && defaultValues.nightEntry) {
      defaultValues.nightEntry[String(step._id)] =
        journalEntryData?.nightEntry?.[String(step._id)] || [];
    }
  });

  return defaultValues;
}

//NOTE: Helper to get field counts for progress indicators
type GetFieldCountParams = {
  _id: string;
  type: JournalStepType;
  // field: string; //NOTE: need to check if field name was the disc value, will need to remove
  watch: UseFormWatch<JournalEntry>;
};
// Dynamically get counts for any field
// For the second error, update the getFieldCount function to handle the "other" category:
export function getFieldCount(params: GetFieldCountParams): number {
  const {
    _id,
    type,
    // field,
    watch,
  } = params;
  if (type === "dayEntry") {
    return watch(`dayEntry.${_id}`)?.length || 0;
  } else if (type === "nightEntry") {
    return watch(`nightEntry.${_id}`)?.length || 0;
  } else {
    // For "other" category, we don't have a specific entry type
    // Return 0 or handle it differently based on your requirements
    return 0;
  }
}

//NOTE: Creates progress props for the FormStepProgress component
type CreateProgressPropsParams = {
  formSteps: JournalCustomStep[];
  watch: UseFormWatch<JournalEntry>;
  getValues: () => JournalEntry;
};

export function createProgressProps(params: CreateProgressPropsParams) {
  const { formSteps, watch, getValues } = params;

  // Habit XP calculation
  const formValues = getValues();
  const habitXpValues = calculateHabitsXpFromEntry({
    entryHabits: formValues.habits || {},
    entryWillpower: formValues.dailyWillpower + formValues.bonusWillpower, // Fixed to use bonusWillpower instead of duplicating dailyWillpower
  });

  // Helper function to count matching elements
  const countMatchingElements = (arr1: any[] = [], arr2: any[] = []) => {
    const set1 = new Set(arr1);
    return arr2.filter((element) => set1.has(element)).length;
  };

  // Helper to count non-zero values
  const countNonZeroValues = (obj: Record<string, number>) =>
    Object.values(obj).filter((value) => value !== 0).length;

  const progressProps: {
    dailyGoals: number;
    dailyGoalsCompleted: number;
    habitActionsCount: number;
    [key: `${string}Count`]: number;
  } = {
    // Add the dailyGoals for the day step
    dailyGoals: watch("dayEntry.day")?.length || 0,
    // Add the dailyGoalsCompleted for the night step
    dailyGoalsCompleted: countMatchingElements(
      watch("dayEntry.day"),
      watch("nightEntry.night")
    ),
    // Add habitActionsCount for the habits step
    habitActionsCount: countNonZeroValues(habitXpValues),
  };

  // Add counts for all steps
  formSteps.forEach((step) => {
    progressProps[`${step._id}Count`] = getFieldCount({
      type: step.type,
      _id: String(step._id),
      watch,
    });
  });

  return progressProps;
}
