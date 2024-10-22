import { useMemo } from "react";
import { calculateHabitLevel, getHabitRarity } from "@lib/level";

export function useIconRarityLevel(xp: number | undefined) {
  return useMemo(() => {
    if (xp === undefined) {
      return { iconColorClass: "", bgColorClass: "" };
    }
    const level = calculateHabitLevel(xp);
    const { bg, icon } = getHabitRarity(level);

    return { iconColorClass: icon, bgColorClass: bg };
  }, [xp]);
}
