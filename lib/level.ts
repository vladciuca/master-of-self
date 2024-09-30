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

export const getRarityColor = (level: number): { bg: string; icon: string } => {
  if (level >= 60) return { bg: "bg-orange-200", icon: "text-orange-500" }; // Legendary
  if (level >= 40) return { bg: "bg-purple-200", icon: "text-purple-600" }; // Epic
  if (level >= 20) return { bg: "bg-blue-200", icon: "text-blue-500" }; // Rare
  if (level >= 10) return { bg: "bg-green-200", icon: "text-green-500" }; // Uncommon
  return { bg: "bg-gray-200", icon: "text-gray-500" }; // Common
};
