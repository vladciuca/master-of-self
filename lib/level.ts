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
    return { bg: "bg-red-200", icon: "text-red-500", label: "Transcendent" };
  if (level >= 30)
    return { bg: "bg-orange-200", icon: "text-orange-500", label: "Legendary" };
  if (level >= 20)
    return { bg: "bg-purple-200", icon: "text-purple-500", label: "Epic" };
  if (level >= 10)
    return { bg: "bg-blue-200", icon: "text-blue-500", label: "Rare" };
  if (level >= 5)
    return { bg: "bg-green-200", icon: "text-green-500", label: "Uncommon" };
  return { bg: "bg-gray-200", icon: "text-gray-500", label: "Common" };
};

export const applyWillpowerBonus = (
  baseXp: number,
  willpower: number
): number => {
  const willpowerMultiplier = 1 + willpower / 100;
  return Math.round(baseXp * willpowerMultiplier);
};

import { Habit, Actions, ActionItem } from "@models/types";
// GET INDIVIDUAL ACTION VALUES FOR HABITS FROM JOURNAL ENTRY - Removes currentXp key from actions
export const getHabitActionValuesFromEntry = (
  actions: Actions
): { [habitId: string]: { [actionId: string]: number } } => {
  return Object.entries(actions).reduce((acc, [habitId, habitActions]) => {
    const { currentXp, ...actionValues } = habitActions;
    acc[habitId] = actionValues;
    return acc;
  }, {} as { [habitId: string]: { [actionId: string]: number } });
};

// CALCULATES INDIVIDUAL HABIT XP VALUES FORM JOURNAL ENTRY - Excluding currentXp key from actions
export const calculateHabitsXpFromEntry = (
  actions: Record<string, Record<string, number>>,
  willpower: number
) => {
  return Object.entries(actions).reduce((acc, [habitId, habitActions]) => {
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
): { [habitId: string]: ActionItem & { currentXp?: number } } => {
  const { includeCurrentXp = false } = options;

  return habits.reduce((acc, habit) => {
    const habitActions = habit.actions.reduce((actionAcc, action) => {
      if (action.type === "defensive") {
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
  }, {} as { [habitId: string]: ActionItem & { currentXp?: number } });
};

// will possibly need to remove IN FUTURE REFACTOR action-id keys if they are deleted
export function deepMergeHabitsWithNewDefaultValues(
  actionChanges: Actions,
  latestDefault: Actions
): Actions {
  const result: Actions = { ...actionChanges };

  for (const [outerKey, outerValue] of Object.entries(latestDefault)) {
    if (!(outerKey in result)) {
      // If the outer key doesn't exist in result, add it with all its properties
      result[outerKey] = { ...outerValue };
    } else {
      // If the outer key exists, we need to merge the inner properties
      for (const [innerKey, innerValue] of Object.entries(outerValue)) {
        if (innerKey === "currentXp") {
          // Don't overwrite existing currentXp
          if (!("currentXp" in result[outerKey])) {
            result[outerKey].currentXp = innerValue as number;
          }
        } else if (!(innerKey in result[outerKey])) {
          // If the inner key doesn't exist in result, add it
          result[outerKey][innerKey] = innerValue;
        }
      }
    }
  }

  return result;
}
