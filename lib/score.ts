import { HABIT_COLORS } from "@lib/colors";
import type { JournalEntry, UserDisciplines } from "@models/types";

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

// JOURNAL

export function calculateStepScore(entryList: string[]): number {
  const totalEntries = entryList.length;
  const totalLength = entryList.join("").length;
  const baseScoreMultiplier = 5;
  const scalingFactor = 10;
  return Math.floor(
    (totalEntries * baseScoreMultiplier + totalLength) / scalingFactor
  );
}

// NOTE: currently only used in the NIGHT_JOURNAL_STEP for MOTIVATION discipline
export function calculateStepScoreMultiplier(entryList: string[]): number {
  //NOTE: this is used so that the multiplication defaults to 1 when [] is empty
  // and starts from x2 when [] has 1 element
  const baseMultiplier = 1;
  return (entryList ?? []).length + baseMultiplier;
}

// Calculate discipline scores from day entry only
export function getDayDisciplineScores(
  dayEntry: any | null | undefined
): Partial<UserDisciplines> {
  if (!dayEntry) return {};

  return {
    positivity: calculateStepScore(dayEntry?.gratitude ?? []),
    motivation: calculateStepScore(dayEntry?.day ?? []), // Base motivation without multiplier
    confidence: calculateStepScore(dayEntry?.affirmations ?? []),
  };
}

// Calculate discipline scores from night entry only
export function getNightDisciplineScores(
  nightEntry: any | null | undefined
): Partial<UserDisciplines> {
  if (!nightEntry) return {};

  //NOTE: might use in the future
  // Calculate night motivation score after multiplier if day motivation is provided
  // const dayMotivation = calculateStepScore(dayEntry?.day ?? []);
  // const motivationNightScore =
  //   dayMotivation > 0
  //     ? dayMotivation * calculateStepScoreMultiplier(nightEntry?.night ?? []) -
  //       dayMotivation
  //     : 0;

  return {
    // Add motivation multiplier effect (the additional motivation from night entry)
    motivation: calculateStepScoreMultiplier(nightEntry?.night ?? []),
    // motivation: nightEntry?.night ?? [],
    awareness: calculateStepScore(nightEntry?.highlights ?? []),
    resilience: calculateStepScore(nightEntry?.reflection ?? []),
  };
}

// Combined function that uses both day and night functions
export function getDisciplineScoreFromEntry(
  entry: JournalEntry | null | undefined
): UserDisciplines {
  if (!entry) return {};

  // Get day scores
  const dayScores = getDayDisciplineScores(entry?.dayEntry);

  // Get night scores, passing the day motivation for proper multiplier calculation
  const nightScores = getNightDisciplineScores(entry?.nightEntry);

  // Combine the scores
  return {
    positivity: dayScores.positivity || 0,
    // For motivation, if we have night entry, use the multiplied value, otherwise just day motivation
    motivation:
      (entry?.nightEntry?.night?.length
        ? calculateStepScore(entry?.dayEntry?.day ?? []) *
          calculateStepScoreMultiplier(entry?.nightEntry?.night ?? [])
        : dayScores.motivation) || 0,
    confidence: dayScores.confidence || 0,
    awareness: nightScores.awareness || 0,
    resilience: nightScores.resilience || 0,
  };
}
