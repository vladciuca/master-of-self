import { useMemo } from "react";
import { calculateLevel, getRarityColor } from "@lib/level";

export function useIconRarityLevel(xp: number | undefined) {
  return useMemo(() => {
    if (xp === undefined) {
      return { iconColorClass: "", bgColorClass: "" };
    }
    const level = calculateLevel(xp);
    const { bg, icon } = getRarityColor(level);

    return { iconColorClass: icon, bgColorClass: bg };
  }, [xp]);
}
