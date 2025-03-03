// import { useTodayJournalEntry } from "./useTodayJournalEntry";
// import { useUserHabits } from "./useUserHabits";
// import {
//   getHabitActionDefaultValues,
//   deepMergeHabitsWithNewDefaultValues,
// } from "@lib/level";

// export function useJournalHabitsSync() {
//   const { todayEntry, todayEntryLoading, todayEntryError } =
//     useTodayJournalEntry();
//   const { habits, habitsLoading, habitsError } = useUserHabits();

//   // Default to empty objects if data isn't available
//   const latestDefaultHabitValues =
//     !habitsLoading && habits ? getHabitActionDefaultValues(habits) : {};
//   const journalHabitValues =
//     !todayEntryLoading && todayEntry ? todayEntry.habits : {};

//   const mergeHabitValuesParams = {
//     journalValues: journalHabitValues,
//     defaultValues: latestDefaultHabitValues,
//   };
//   const mergedHabitValues =
//     !todayEntryLoading && !habitsLoading
//       ? deepMergeHabitsWithNewDefaultValues(mergeHabitValuesParams)
//       : {};

//   return {
//     latestDefaultHabitValues,
//     journalHabitValues,
//     mergedHabitValues,
//   };
// }

import { useState, useEffect, useCallback } from "react";

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
  const [updateStatus, setUpdateStatus] = useState<{
    isUpdating: boolean;
    success: boolean;
    error: string | null;
  }>({
    isUpdating: false,
    success: false,
    error: null,
  });

  // Default to empty objects if data isn't available
  const latestDefaultHabitValues =
    !habitsLoading && habits ? getHabitActionDefaultValues(habits) : {};
  const journalHabitValues =
    !todayEntryLoading && todayEntry ? todayEntry.habits : {};

  const mergeHabitValuesParams = {
    journalValues: journalHabitValues,
    defaultValues: latestDefaultHabitValues,
  };

  const mergedHabitValues =
    !todayEntryLoading && !habitsLoading
      ? deepMergeHabitsWithNewDefaultValues(mergeHabitValuesParams)
      : {};

  const updateJournalHabits = useCallback(async () => {
    if (!todayEntry || !todayEntry._id) return;

    setUpdateStatus({ isUpdating: true, success: false, error: null });

    try {
      const response = await fetch(
        `/api/journal-entry/${todayEntry._id}/update-habits`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ habits: mergedHabitValues }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update habits");
      }

      setUpdateStatus({ isUpdating: false, success: true, error: null });
    } catch (error) {
      console.error("Error updating journal habits:", error);
      setUpdateStatus({
        isUpdating: false,
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }, [todayEntry, mergedHabitValues]);

  // Automatically update habits when merged values change
  useEffect(() => {
    if (
      todayEntry?._id &&
      !todayEntryLoading &&
      !habitsLoading &&
      Object.keys(mergedHabitValues).length > 0
    ) {
      updateJournalHabits();
    }
  }, [
    todayEntry?._id,
    todayEntryLoading,
    habitsLoading,
    mergedHabitValues,
    updateJournalHabits,
  ]);

  return {
    latestDefaultHabitValues,
    journalHabitValues,
    mergedHabitValues,
    updateJournalHabits,
    isUpdating: updateStatus.isUpdating,
    updateSuccess: updateStatus.success,
    updateError: updateStatus.error,
  };
}
