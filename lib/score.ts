import { HABIT_COLORS } from "@lib/colors";
import type {
  JournalEntry,
  JournalDayEntry,
  JournalNightEntry,
} from "@models/types";

// HABITS ACTION VALUES
type HabitActionValueParams = {
  value: number;
  dailyTarget: number;
  isActionBreak: boolean;
};

export function displayActionValue({
  value,
  dailyTarget,
  isActionBreak,
}: HabitActionValueParams): number {
  return isActionBreak ? dailyTarget - value : value;
}

export function isDailyTargetCompleted({
  value,
  dailyTarget,
}: HabitActionValueParams): boolean {
  return value >= dailyTarget;
}

const BURN_OUT_MULTIPLIER = 1.5;

export function isActionOverCapped({
  value,
  dailyTarget,
  isActionBreak,
}: HabitActionValueParams): boolean {
  return isActionBreak ? value < 0 : value > BURN_OUT_MULTIPLIER * dailyTarget;
}

export function getActionValueColor(params: HabitActionValueParams): string {
  if (isActionOverCapped(params)) {
    return params.isActionBreak
      ? `text-${HABIT_COLORS.failed}`
      : `text-${HABIT_COLORS.burnedOut}`;
  }

  if (isDailyTargetCompleted(params)) {
    return `text-${HABIT_COLORS.completed}`;
  }

  return "text-primary";
}

// JOURNAL DISCIPLINE SCORE FUNCTIONS

export function calculateStepScore(entryList: string[]): number {
  const totalEntries = entryList?.length || 0;
  const totalLength = (entryList || []).join("").length;
  const baseScoreMultiplier = 5;
  const scalingFactor = 10;
  return Math.floor(
    (totalEntries * baseScoreMultiplier + totalLength) / scalingFactor
  );
}

export function calculateStepScoreMultiplier(entryList: string[]): number {
  const baseMultiplier = 1;
  return (entryList || []).length + baseMultiplier;
}

// Updated to process all keys in the entry object as disciplines
export function getDayDisciplineScores(
  dayEntry: JournalDayEntry | null | undefined
): Record<string, number> {
  if (!dayEntry) return {};

  const disciplines: Record<string, number> = {};

  // Process all keys in dayEntry as disciplines
  Object.entries(dayEntry).forEach(([key, value]) => {
    // Skip non-array values
    if (!Array.isArray(value)) return;

    // Special handling for "day" key (motivation)
    if (key === "day") {
      disciplines.motivation = calculateStepScore(value);
    } else {
      // For all other keys, calculate score normally
      disciplines[key] = calculateStepScore(value);
    }
  });

  return disciplines;
}

// Updated to process all keys in the entry object as disciplines
export function getNightDisciplineScores(
  nightEntry: JournalNightEntry | null | undefined
): Record<string, number> {
  if (!nightEntry) return {};

  const disciplines: Record<string, number> = {};

  // Process all keys in nightEntry as disciplines
  Object.entries(nightEntry).forEach(([key, value]) => {
    // Skip non-array values
    if (!Array.isArray(value)) return;

    // Special handling for "night" key (only returns: motivation multiplier)
    if (key === "night") {
      disciplines.motivation = calculateStepScoreMultiplier(value);
    } else {
      // For all other keys, calculate score normally
      disciplines[key] = calculateStepScore(value);
    }
  });

  return disciplines;
}

// Combined function that uses both day and night functions
export function getDisciplineScoreFromEntry(
  entry: JournalEntry | null | undefined
): Record<string, number> {
  if (!entry) return {};

  // Get day scores
  const dayScores = getDayDisciplineScores(entry?.dayEntry);

  // Get night scores
  const nightScores = getNightDisciplineScores(entry?.nightEntry);

  // Combine the scores
  const combinedScores: Record<string, number> = { ...dayScores };

  // Add night scores
  Object.entries(nightScores).forEach(([key, value]) => {
    if (key === "motivation") {
      // Special handling for motivation
      const dayMotivation = Number(dayScores.motivation);

      // Check if day motivation exists and is valid
      if (
        !isNaN(dayMotivation) &&
        dayMotivation > 0 &&
        Array.isArray(entry?.dayEntry?.day) &&
        entry.dayEntry.day.length > 0
      ) {
        // Only multiply if day motivation is valid
        combinedScores[key] = dayMotivation * value;
      } else {
        // Otherwise set to 0
        combinedScores[key] = 0;
      }
    } else {
      // Add all other night scores directly
      combinedScores[key] = value;
    }
  });

  return combinedScores;
}
