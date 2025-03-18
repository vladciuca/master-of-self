import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Session, JournalEntryHabit } from "@models/types";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";
import { useLastJournalEntry } from "./useLastJournalEntry";
import { useUpdateHabits } from "@hooks/habits/useUpdateHabits";
import { useUserHabits } from "@hooks/useUserHabits";
import { getToday } from "@lib/time";
import { getHabitActionDefaultValues } from "@lib/level";

export function useCreateJournalEntry() {
  const [submittingJournalEntry, setSubmittingJournalEntry] =
    useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };

  const { lastEntry, lastEntryLoading, lastEntryError, habitsXp } =
    useLastJournalEntry();
  const { bonusWillpower, yesterdayEntryLoading, yesterdayEntryError } =
    useYesterdayJournalEntry();

  const { habits, hasHabits, habitsLoading, habitsError } = useUserHabits();

  const { updateHabits, updateHabitsSubmitting, updateHabitsError } =
    useUpdateHabits();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort fetch requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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
      updateHabitsSubmitting
    ) {
      console.warn("Waiting for all dependent hooks to finish loading...");
      return;
    }

    // Ensure no errors before proceeding
    if (
      yesterdayEntryError ||
      habitsError ||
      lastEntryError ||
      updateHabitsError
    ) {
      throw new Error(
        `Error fetching required data: 
        Yesterday Entry: ${yesterdayEntryError}, 
        Habits: ${habitsError}, 
        Last Entry: ${lastEntryError}, 
        Update Habits: ${updateHabitsError}`
      );
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // setSubmittingJournalEntry(false);
    setSubmittingJournalEntry(false);

    try {
      setSubmittingJournalEntry(true);

      const today = getToday();
      const todayDate = today.toISOString().split("T")[0];

      // NOTE: Must not crete entry before updating the Habits XP
      // Parallel API updates
      await Promise.allSettled([
        // NOTE: Might need to check vs hasHabits too to do the update here and also lastEntry
        lastEntry && hasHabits
          ? updateHabits({
              habitsXpUpdates: habitsXp,
              habitActionsUpdates: lastEntry.habits,
              updateDate: todayDate,
            })
          : Promise.resolve(), // If lastEntry is null / the user doesn't have habits, resolve immediately
      ]);

      const defaultJournalEntryActionValues: JournalEntryHabit = hasHabits
        ? getHabitActionDefaultValues(habits, {
            includeCurrentXp: true,
          })
        : {};

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
            // HERE might need a check if the user dosent have habits do not run this function
            // But this should be encapsulated inside the useHabits hook right?! nigger
            habits: defaultJournalEntryActionValues,
          }),
          signal, // Attach signal to the request
        }
      );

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
      throw error;
    }
  };

  return { createJournalEntry, submittingJournalEntry };
}
