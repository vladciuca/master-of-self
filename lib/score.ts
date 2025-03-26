import { HABIT_COLORS } from "@lib/colors";
import type { JournalEntry, UserDisciplines } from "@models/types";

// JOURNAL
export function calculateWillpowerScore(stringArray: string[]): number {
  const totalEntries = stringArray.length;
  const totalLength = stringArray.join("").length;
  return Math.floor((totalEntries * 5 + totalLength) / 10);
}

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

//Journal-Refactor

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

export function getDisciplineScoreFromEntry(
  entry: JournalEntry | null | undefined
): UserDisciplines {
  if (!entry) return {};

  return {
    positivity: calculateStepScore(entry?.dayEntry?.gratitude ?? []),
    motivation:
      calculateStepScore(entry?.dayEntry?.day ?? []) *
      calculateStepScoreMultiplier(entry?.nightEntry?.night ?? []),
    confidence: calculateStepScore(entry?.dayEntry?.affirmations ?? []),
    awareness: calculateStepScore(entry?.nightEntry?.highlights ?? []),
    resilience: calculateStepScore(entry?.nightEntry?.reflection ?? []),
  };
}
