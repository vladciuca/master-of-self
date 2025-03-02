import { useTodayJournalEntry } from "./useTodayJournalEntry";
import { useUserHabits } from "./useUserHabits";
import {
  getHabitActionDefaultValues,
  deepMergeHabitsWithNewDefaultValues,
} from "@lib/level";

export function useJournalHabitsSync() {
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { habits, habitsLoading, habitsError } = useUserHabits();

  // Default to empty objects if data isn't available
  const latestDefaultHabitValues =
    !habitsLoading && habits ? getHabitActionDefaultValues(habits) : {};
  const journalHabitValues =
    !todayEntryLoading && todayEntry ? todayEntry.habits : {};

  const mergeHabitValuesParams = {
    values: journalHabitValues,
    defaultValues: latestDefaultHabitValues,
  };
  const mergedHabitValues =
    !todayEntryLoading && !habitsLoading
      ? deepMergeHabitsWithNewDefaultValues(mergeHabitValuesParams)
      : {};

  return {
    latestDefaultHabitValues,
    journalHabitValues,
    mergedHabitValues,
  };
}
