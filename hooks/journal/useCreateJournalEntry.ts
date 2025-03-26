import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";
import { useLastJournalEntry } from "./useLastJournalEntry";
import { useUpdateHabits } from "@hooks/habits/useUpdateHabits";
import { useUpdateDisciplines } from "@hooks/user/useUpdateDisciplines";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { getToday } from "@lib/time";
import {
  calculateStepScore,
  calculateStepScoreMultiplier,
  getDisciplineScoreFromEntry,
} from "@lib/score";
import { Session, UserDisciplines } from "@models/types";

export function useCreateJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };

  const { lastEntry, lastEntryLoading, lastEntryError, habitsXp } =
    useLastJournalEntry();
  const { bonusWillpower, yesterdayEntryLoading, yesterdayEntryError } =
    useYesterdayJournalEntry();

  const [submittingJournalEntry, setSubmittingJournalEntry] =
    useState<boolean>(false);
  // NOTE: create submit error here
  const [createJournalEntryError, setCreateJournalEntryError] = useState<
    string | null
  >(null);

  const {
    hasHabits,
    defaultJournalEntryHabitActionValues,
    habitsLoading,
    habitsError,
  } = useUserHabits();

  const { updateHabits, submittingHabitsUpdate, updateHabitsError } =
    useUpdateHabits();
  const {
    updateDisciplines,
    submittingDisciplinesUpdate,
    updateDisciplinesError,
  } = useUpdateDisciplines();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort fetch requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const createJournalEntry = async () => {
    if (!session?.user.id) throw new Error("User not authenticated");

    // NOTE: Chaining Loading states and errors here is used because:
    // the createJournalEntry function is dependent all the data from these calls!
    // Ensure all dependencies are loaded
    if (
      yesterdayEntryLoading ||
      habitsLoading ||
      lastEntryLoading ||
      submittingHabitsUpdate ||
      submittingDisciplinesUpdate
    ) {
      console.warn("Waiting for all dependent hooks to finish loading...");
      return;
    }

    // Ensure no errors before proceeding
    if (
      yesterdayEntryError ||
      habitsError ||
      lastEntryError ||
      updateHabitsError ||
      updateDisciplinesError
    ) {
      throw new Error(
        `Error fetching required data: 
        Yesterday Entry: ${yesterdayEntryError}, 
        Habits: ${habitsError}, 
        Last Entry: ${lastEntryError}, 
        Update Habits: ${updateHabitsError},
        Update Disciplines: ${updateDisciplinesError}`
      );
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setSubmittingJournalEntry(false);
    setCreateJournalEntryError(null);

    try {
      setSubmittingJournalEntry(true);

      const today = getToday();
      const todayDate = today.toISOString().split("T")[0];

      //NOTE: they do not respect the other when saved in DB
      // const disciplinesPayload = {
      //   positivity: calculateStepScore(lastEntry?.dayEntry?.gratitude ?? []),
      //   motivation:
      //     calculateStepScore(lastEntry?.dayEntry?.day ?? []) *
      //     calculateStepScoreMultiplier(lastEntry?.nightEntry?.night ?? []),
      //   confidence: calculateStepScore(lastEntry?.dayEntry?.affirmations ?? []),
      //   awareness: calculateStepScore(lastEntry?.nightEntry?.highlights ?? []),
      //   resilience: calculateStepScore(lastEntry?.nightEntry?.reflection ?? []),
      // };

      const disciplinesPayload: UserDisciplines = lastEntry
        ? getDisciplineScoreFromEntry(lastEntry)
        : {};

      // NOTE: Must NOT create entry before updating the Habits XP
      // Parallel API updates
      await Promise.allSettled([
        lastEntry ? updateDisciplines(disciplinesPayload) : Promise.resolve(),

        hasHabits && lastEntry
          ? updateHabits({
              habitsXpUpdates: habitsXp,
              habitActionsUpdates: lastEntry.habits,
              updateDate: todayDate,
            })
          : Promise.resolve(), // If lastEntry is null / the user doesn't have habits, resolve immediately
      ]);

      const createNewEntryResponse = await fetch(
        `/api/journal-entry/new?today=${today}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            dailyWillpower: 0,
            bonusWillpower: bonusWillpower ?? 0,
            habits: defaultJournalEntryHabitActionValues,
          }),
          signal, // Attach signal to the request
        }
      );

      if (signal.aborted) return;

      if (!createNewEntryResponse.ok) {
        const errorData = await createNewEntryResponse.json();
        throw new Error(`Failed to create new entry: ${errorData.error}`);
      }

      const newEntry = await createNewEntryResponse.json();

      if (!newEntry?._id) {
        throw new Error("Failed to create new entry: No _id returned");
      }

      return newEntry._id;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Create journal entry request was aborted.");
        return;
      }

      console.error("Error creating new entry:", error);
      setSubmittingJournalEntry(false);
      setCreateJournalEntryError(
        (error as Error).message || "Failed to create habit"
      );
      throw error;
    }
  };

  return {
    createJournalEntry,
    submittingJournalEntry,
    createJournalEntryError,
  };
}
