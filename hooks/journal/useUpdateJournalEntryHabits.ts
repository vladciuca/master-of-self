import { useState, useEffect, useRef } from "react";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import {
  getHabitActionDefaultValues,
  deepMergeHabitsWithNewDefaultValues,
} from "@lib/level";
import type { Habit } from "@models/types";

export function useUpdateJournalEntryHabits() {
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();

  const [submittingJournalHabitsUpdate, setSubmittingJournalHabitsUpdate] =
    useState(false);
  const [updateJournalHabitsError, setUpdateJournalHabitsError] = useState<
    string | null
  >(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const updateJournalEntryHabits = async (habit: Habit) => {
    if (todayEntryLoading) {
      console.warn("Waiting for all dependent hooks to finish loading...");
      return;
    }

    if (todayEntryError) {
      throw new Error(`Error fetching required data: ${todayEntryError}`);
    }

    if (!todayEntry || !todayEntry._id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setSubmittingJournalHabitsUpdate(true);
    setUpdateJournalHabitsError(null);
    try {
      // NOTE: the getHabitActionDefaultValues takes in an array of habits
      // We must put the newly created habit inside an array
      const newHabitInArray = [habit];
      const defaultActionValuesFromHabit =
        getHabitActionDefaultValues(newHabitInArray);

      // NOTE: .habits key will always exist
      // as it is created with habit default values || 0 on any new journal entry
      const journalHabitValues = todayEntry.habits;

      const mergeHabitValuesParams = {
        journalValues: journalHabitValues,
        defaultValues: defaultActionValuesFromHabit,
      };

      const mergedHabitValues = !todayEntryLoading
        ? deepMergeHabitsWithNewDefaultValues(mergeHabitValuesParams)
        : {};

      const response = await fetch(
        `/api/journal-entry/${todayEntry._id}/update-habits`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ habits: mergedHabitValues }),
          signal,
        }
      );

      if (signal.aborted) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update habits");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Fetch request was aborted");
        return;
      }

      console.error("Error updating habits:", error);
      setUpdateJournalHabitsError("Failed to update habit XP");
      throw error;
    } finally {
      if (!signal.aborted) {
        setSubmittingJournalHabitsUpdate(false);
      }
    }
  };

  return {
    updateJournalEntryHabits,
    submittingJournalHabitsUpdate,
    updateJournalHabitsError,
  };
}
