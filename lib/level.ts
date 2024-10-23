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

export const calculateHabitsXpSumsFromActions = (
  actions: Record<string, Record<string, number>>,
  dailyWillpower: number
) => {
  // Calculate the willpower multiplier
  const willpowerMultiplier = 1 + dailyWillpower / 100;

  return Object.entries(actions).reduce((acc, [habitId, habitActions]) => {
    // Calculate the base XP sum for the habit
    const baseXp = Object.values(habitActions).reduce(
      (sum, value) => sum + value,
      0
    );

    // Apply the willpower multiplier and round to the nearest integer
    acc[habitId] = Math.round(baseXp * willpowerMultiplier);

    return acc;
  }, {} as Record<string, number>);
};
