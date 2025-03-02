import { HABIT_TIER_COLORS } from "@lib/colors";

// XP FOR CHAR
export function xpForLevel(level: number) {
  let baseXP = 0;
  let xpRequired = 50;

  for (let i = 1; i < level; i++) {
    baseXP += xpRequired;
    xpRequired += 50;
  }

  return { baseXP, nextLevelXP: baseXP + xpRequired };
}

export function calculateLevel(xp: number) {
  let level = 1;

  while (true) {
    const { nextLevelXP } = xpForLevel(level);
    if (xp < nextLevelXP) {
      return level;
    }
    level++;
  }
}

// XP FOR HABITS
export function xpForHabitLevel(level: number) {
  let baseXP = 0;
  let xpRequired = 10;

  for (let i = 1; i < level; i++) {
    baseXP += xpRequired;
    xpRequired += 5;
  }

  return { baseXP, nextLevelXP: baseXP + xpRequired };
}

export function calculateHabitLevel(xp: number) {
  let level = 1;

  while (true) {
    const { nextLevelXP } = xpForHabitLevel(level);
    if (xp < nextLevelXP) {
      return level;
    }
    level++;
  }
}

export const getHabitRarity = (
  level: number
): { bg: string; icon: string; label: string } => {
  if (level >= 40)
    return {
      bg: `bg-${HABIT_TIER_COLORS.transcendent.background}`,
      icon: `text-${HABIT_TIER_COLORS.transcendent.foreground}`,
      label: "Transcendent",
    };
  if (level >= 30)
    return {
      bg: `bg-${HABIT_TIER_COLORS.legendary.background}`,
      icon: `text-${HABIT_TIER_COLORS.legendary.foreground}`,
      label: "Legendary",
    };
  if (level >= 20)
    return {
      bg: `bg-${HABIT_TIER_COLORS.epic.background}`,
      icon: `text-${HABIT_TIER_COLORS.epic.foreground}`,
      label: "Epic",
    };
  if (level >= 10)
    return {
      bg: `bg-${HABIT_TIER_COLORS.rare.background}`,
      icon: `text-${HABIT_TIER_COLORS.rare.foreground}`,
      label: "Rare",
    };
  if (level >= 5)
    return {
      bg: `bg-${HABIT_TIER_COLORS.uncommon.background}`,
      icon: `text-${HABIT_TIER_COLORS.uncommon.foreground}`,
      label: "Uncommon",
    };
  return {
    bg: `bg-${HABIT_TIER_COLORS.common.background}`,
    icon: `text-${HABIT_TIER_COLORS.common.foreground}`,
    label: "Common",
  };
};

export const applyWillpowerBonus = (
  baseXp: number,
  willpower: number
): number => {
  const willpowerMultiplier = 1 + willpower / 100;
  return Math.round(baseXp * willpowerMultiplier);
};

import {
  Habit,
  JournalEntryHabit,
  JournalEntryHabitActions,
} from "@models/types";
// GET INDIVIDUAL ACTION VALUES FOR HABITS FROM JOURNAL ENTRY - Removes currentXp key from actions
export const getHabitActionValuesFromEntry = (
  habits: JournalEntryHabit
): { [habitId: string]: { [actionId: string]: number } } => {
  return Object.entries(habits).reduce((acc, [habitId, habitActions]) => {
    const { currentXp, ...actionValues } = habitActions;
    acc[habitId] = actionValues;
    return acc;
  }, {} as { [habitId: string]: { [actionId: string]: number } });
};

// CALCULATES INDIVIDUAL HABIT XP VALUES FORM JOURNAL ENTRY - Excluding currentXp key from actions
export const calculateHabitsXpFromEntry = (
  habits: Record<string, Record<string, number>>,
  willpower: number
) => {
  return Object.entries(habits).reduce((acc, [habitId, habitActions]) => {
    // Calculate the base XP sum for the habit, excluding the 'currentXp' key
    const baseXp = Object.entries(habitActions).reduce(
      (sum, [key, value]) => (key !== "currentXp" ? sum + value : sum),
      0
    );

    // Apply the willpower bonus and round to the nearest integer
    acc[habitId] = applyWillpowerBonus(baseXp, willpower);

    return acc;
  }, {} as Record<string, number>);
};

// NOTE: NEVER USED - should remove or use in conjunction with getHabitActionValues
// if needed, because it DOESN'T REMOVE 'currentXp' key from Habits
// GET HABIT XP SUM FROM ACTIONS - will need willpower multiplier here
// export const calculateHabitXpFromActionValues = (
//   actions: { [habitId: string]: { [actionId: string]: number } },
//   willpower: number
// ): { [habitId: string]: number } => {
//   return Object.entries(actions).reduce((acc, [habitId, habitActions]) => {
//     const baseXp = Object.values(habitActions).reduce(
//       (sum, value) => sum + value,
//       0
//     );
//     acc[habitId] = applyWillpowerBonus(baseXp, willpower);
//     return acc;
//   }, {} as { [habitId: string]: number });
// };

// GET THE DEFAULT ACTION VALUES FOR HABITS - based on habit type
// also includes option for current habit XP - used for useCreateJournalEntry hook
export const getHabitActionDefaultValues = (
  habits: Habit[],
  options: { includeCurrentXp?: boolean } = {}
): { [habitId: string]: JournalEntryHabitActions & { currentXp?: number } } => {
  const { includeCurrentXp = false } = options;

  return habits.reduce((acc, habit) => {
    const habitActions = habit.actions.reduce((actionAcc, action) => {
      if (action.type === "break") {
        actionAcc[action.id] = action.dailyTarget;
      } else {
        actionAcc[action.id] = 0;
      }
      return actionAcc;
    }, {} as { [actionId: string]: number });

    if (includeCurrentXp) {
      acc[habit._id] = {
        ...habitActions,
        currentXp: habit.xp,
      };
    } else {
      acc[habit._id] = habitActions;
    }

    return acc;
  }, {} as { [habitId: string]: JournalEntryHabitActions & { currentXp?: number } });
};

// Merge Habit Values function param vales
type MergeDefaultHabitValueParams = {
  values: JournalEntryHabit;
  defaultValues: JournalEntryHabit;
};
// NOTE: must add {values: habitActionChanges, defaultValue: latestDefault} here for merge safety
export function deepMergeHabitsWithNewDefaultValues({
  values,
  defaultValues,
}: MergeDefaultHabitValueParams): JournalEntryHabit {
  // Shallow copy won't keep original object nested properties references
  // example of shallow copy: const result: JournalEntryHabit = { ...habitActionChanges };
  // NOTE: we do not want to create a shallow copy as the nested objects will keep its references
  const result: JournalEntryHabit = structuredClone(values);

  for (const [outerKey, outerValue] of Object.entries(defaultValues)) {
    if (!(outerKey in result)) {
      // If the outer key(new habit) is missing, add it and set currentXp to 0
      // NOTE: We set the currentXp here to 0 as default because it means
      // that the Habit was just created after today's Journal Entry
      // this means that currentXP for the merged habit will always be 0
      result[outerKey] = { ...outerValue, currentXp: 0 };
    } else {
      // Outer key exists, merge missing inner properties
      for (const [innerKey, innerValue] of Object.entries(outerValue)) {
        // NOTE: Here we will only add new action-keys and never delete them
        // They will be removed the next day when a new journal entry is created with the default values
        if (!(innerKey in result[outerKey])) {
          result[outerKey][innerKey] = innerValue;
        }
      }
    }
  }

  return result;
}
