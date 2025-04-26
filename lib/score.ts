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
//====================================================================
// // Updated to process all keys in the entry object as disciplines
// export function getNightDisciplineScores(
//   nightEntry: JournalNightEntry | null | undefined
// ): Record<string, number> {
//   if (!nightEntry) return {};

//   const disciplines: Record<string, number> = {};

//   // Process all keys in nightEntry as disciplines
//   Object.entries(nightEntry).forEach(([key, value]) => {
//     // Skip non-array values
//     if (!Array.isArray(value)) return;

//     // Special handling for "night" key (only returns: motivation multiplier)
//     if (key === "night") {
//       //NOTE: hotfix to return 0 score when there are no elements in the night[]
//       //will refactor this logic in WILLPOWER refactor
//       if (value.length === 0) return (disciplines.motivation = 0);
//       disciplines.motivation = calculateStepScoreMultiplier(value);
//     }
//     // else if (key === "highlights") {
//     //   disciplines.motivation = calculateStepScore(value);
//     // }
//     else {
//       // For all other keys, calculate score normally
//       disciplines[key] = calculateStepScore(value);
//     }
//   });

//   return disciplines;
// }

// // Combined function that uses both day and night functions
// export function getDisciplineScoreFromEntry(
//   entry: JournalEntry | null | undefined
// ): Record<string, number> {
//   if (!entry) return {};

//   // Get day scores
//   const dayScores = getDayDisciplineScores(entry?.dayEntry);

//   // Get night scores
//   const nightScores = getNightDisciplineScores(entry?.nightEntry);

//   // Combine the scores
//   const combinedScores: Record<string, number> = { ...dayScores };

//   // Add night scores
//   Object.entries(nightScores).forEach(([key, value]) => {
//     if (key === "motivation") {
//       const dayMotivation = Number(dayScores.motivation);
//       // const nightMotivation = Number(nightScores.motivation);
//       // const motivationMultiplier = Number(nightScores.motivationMultiplier);

//       //VALIDATIONS
//       const hasValidDayMotivation =
//         !isNaN(dayMotivation) &&
//         dayMotivation > 0 &&
//         Array.isArray(entry?.dayEntry?.day) &&
//         entry.dayEntry.day.length > 0;

//       if (hasValidDayMotivation) {
//         const shouldDefaultNightMotivation =
//           Array.isArray(entry?.nightEntry?.night) &&
//           entry.nightEntry.night.length === 0;

//         const nightMotivation = shouldDefaultNightMotivation ? 1 : value;

//         combinedScores[key] = dayMotivation * nightMotivation;
//       } else {
//         combinedScores[key] = 0;
//       }
//       // const hasValidNightMotivation =
//       //   !isNaN(nightMotivation) &&
//       //   nightMotivation > 0 &&
//       //   Array.isArray(entry?.dayEntry?.highlights) &&
//       //   entry.dayEntry.highlights.length > 0;

//       // if (hasValidDayMotivation || hasValidNightMotivation) {
//       //   combinedScores[key] =
//       //     (dayMotivation + nightMotivation) * motivationMultiplier;
//       // } else {
//       //   combinedScores[key] = 0;
//       // }
//     } else {
//       // Add all other night scores directly
//       combinedScores[key] = value;
//     }
//   });

//   return combinedScores;
// }
export function getNightDisciplineScores(
  nightEntry: JournalNightEntry | null | undefined
): Record<string, number> {
  if (!nightEntry) return {};

  const disciplines: Record<string, number> = {};

  // Process all keys in nightEntry as disciplines
  Object.entries(nightEntry).forEach(([key, value]) => {
    // Skip non-array values
    if (!Array.isArray(value)) return;

    // Special handling for "night" key (stores motivation multiplier)
    if (key === "night") {
      // Default to 1 if there are no elements in night[]
      if (value.length === 0) return (disciplines._motivationMultiplier = 1);
      disciplines._motivationMultiplier = calculateStepScoreMultiplier(value);
    }
    // Special handling for highlights - add to motivation score
    else if (key === "highlights") {
      disciplines._highlightsScore = calculateStepScore(value);
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

  // Extract the internal calculation variables with underscore prefix
  const motivationMultiplier = nightScores._motivationMultiplier || 1;
  const highlightsScore = nightScores._highlightsScore || 0;

  // Remove the internal calculation keys from the result
  delete nightScores._motivationMultiplier;
  delete nightScores._highlightsScore;

  // Calculate the final motivation score
  const dayMotivation = dayScores.motivation || 0;
  combinedScores.motivation =
    (dayMotivation + highlightsScore) * motivationMultiplier;

  // Add remaining night scores (excluding the internal ones we already handled)
  Object.entries(nightScores).forEach(([key, value]) => {
    if (!key.startsWith("_")) {
      // Only add non-internal keys
      combinedScores[key] = value;
    }
  });

  return combinedScores;
}
