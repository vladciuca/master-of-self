import { HABIT_TIER_COLORS } from "@lib/colors";

// Generic XP calculation functions
export function xpForLevel(
  level: number,
  initialXP: number,
  increment: number
) {
  let baseXP = 0;
  let xpRequired = initialXP;

  for (let i = 1; i < level; i++) {
    baseXP += xpRequired;
    xpRequired += increment;
  }

  return { baseXP, nextLevelXP: baseXP + xpRequired };
}

export function calculateLevel(
  xp: number,
  initialXP: number,
  increment: number
) {
  let level = 1;

  while (true) {
    const { nextLevelXP } = xpForLevel(level, initialXP, increment);
    if (xp < nextLevelXP) {
      return level;
    }
    level++;
  }
}

// Constants for different entity types
export const XP_CONFIG = {
  DISCIPLINE: { initialXP: 25, increment: 25 },
  CHARACTER: { initialXP: 50, increment: 50 },
  HABIT: { initialXP: 10, increment: 5 },
};

// Helper functions to maintain backward compatibility
export function xpForDisciplineLevel(level: number) {
  return xpForLevel(
    level,
    XP_CONFIG.DISCIPLINE.initialXP,
    XP_CONFIG.DISCIPLINE.increment
  );
}

export function calculateDisciplineLevel(xp: number) {
  return calculateLevel(
    xp,
    XP_CONFIG.DISCIPLINE.initialXP,
    XP_CONFIG.DISCIPLINE.increment
  );
}

export function xpForCharacterLevel(level: number) {
  return xpForLevel(
    level,
    XP_CONFIG.CHARACTER.initialXP,
    XP_CONFIG.CHARACTER.increment
  );
}

export function calculateCharacterLevel(xp: number) {
  return calculateLevel(
    xp,
    XP_CONFIG.CHARACTER.initialXP,
    XP_CONFIG.CHARACTER.increment
  );
}

export function xpForHabitLevel(level: number) {
  return xpForLevel(
    level,
    XP_CONFIG.HABIT.initialXP,
    XP_CONFIG.HABIT.increment
  );
}

export function calculateHabitLevel(xp: number) {
  return calculateLevel(
    xp,
    XP_CONFIG.HABIT.initialXP,
    XP_CONFIG.HABIT.increment
  );
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
type CalculateHabitXpFromEntryParams = {
  entryHabits: Record<string, Record<string, number>>;
  entryWillpower: number;
};

export const calculateHabitsXpFromEntry = ({
  entryHabits,
  entryWillpower,
}: CalculateHabitXpFromEntryParams) => {
  return Object.entries(entryHabits).reduce((acc, [habitId, habitActions]) => {
    // Calculate the base XP sum for the habit, excluding the 'currentXp' key
    const baseXp = Object.entries(habitActions).reduce(
      (sum, [key, value]) => (key !== "currentXp" ? sum + value : sum),
      0
    );

    // Apply the willpower bonus and round to the nearest integer
    acc[habitId] = applyWillpowerBonus(baseXp, entryWillpower);

    return acc;
  }, {} as Record<string, number>);
};

// GET DATA from JOURNAL ENTRY to calculateHabitsXpFromEntry
type getHabitXpFromEntryProps = {
  entry: any;
  loading: boolean;
  habitId: string;
};

export const getHabitXpFromEntry = ({
  entry,
  loading,
  habitId,
}: getHabitXpFromEntryProps): number => {
  if (loading || !entry) return 0;

  const dailyWillpower = entry?.dailyWillpower || 0;
  const bonusWillpower = entry?.bonusWillpower || 0;
  const totalWillpower = dailyWillpower + bonusWillpower;
  const habits = entry?.habits || {};

  const xpSums = calculateHabitsXpFromEntry({
    entryHabits: habits,
    entryWillpower: totalWillpower,
  });

  return xpSums[habitId] || 0;
};

// GET THE DEFAULT ACTION VALUES FOR HABITS - based on habit type
// also includes option for current habit XP - used for useCreateJournalEntry hook
// THIS IS FOR THE ALL HABITS
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

// THIS IS FOR ONE HABIT BY ID

// Merge Habit Values function param vales
type MergeDefaultHabitValueParams = {
  journalValues: JournalEntryHabit;
  defaultValues: JournalEntryHabit;
};
// NOTE: must add {values: habitActionChanges, defaultValue: latestDefault} here for merge safety
export function deepMergeHabitsWithNewDefaultValues({
  journalValues,
  defaultValues,
}: MergeDefaultHabitValueParams): JournalEntryHabit {
  // Shallow copy won't keep original object nested properties references
  // example of shallow copy: const result: JournalEntryHabit = { ...habitActionChanges };
  // NOTE: we do not want to create a shallow copy as the nested objects will keep its references
  const result: JournalEntryHabit = structuredClone(journalValues);

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
