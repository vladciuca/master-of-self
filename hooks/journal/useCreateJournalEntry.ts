import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";
import { useLastJournalEntry } from "./useLastJournalEntry";
import { useUpdateHabits } from "@hooks/habits/useUpdateHabits";
import { useUserProfile } from "@context/UserProfileContext";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { getToday } from "@lib/time";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { User } from "@models/types";

export function useCreateJournalEntry() {
  const { user } = useUser() as { user: User | null };

  const { lastEntry, lastEntryLoading, habitsXp } = useLastJournalEntry();
  const { bonusWillpower, yesterdayEntryLoading } = useYesterdayJournalEntry();

  const [submittingJournalEntry, setSubmittingJournalEntry] =
    useState<boolean>(false);
  const [createJournalEntryError, setCreateJournalEntryError] = useState<
    string | null
  >(null);

  const {
    hasHabits,
    defaultJournalEntryHabitActionValues,
    habitsLoading,
  } = useUserHabits();

  const { updateHabits, submittingHabitsUpdate } = useUpdateHabits();

  const {
    updatePracticesValues,
    submittingPracticesValuesUpdate,
  } = useUserProfile();

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const createJournalEntry = async () => {
    if (!user?.id) throw new Error("User not authenticated");

    if (
      yesterdayEntryLoading ||
      habitsLoading ||
      lastEntryLoading ||
      submittingHabitsUpdate ||
      submittingPracticesValuesUpdate
    ) {
      console.warn("Waiting for all dependent hooks to finish loading...");
      return;
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

      const disciplinesPayload: Record<string, number> = lastEntry
        ? getDisciplineScoreFromEntry(lastEntry)
        : {};

      await Promise.allSettled([
        lastEntry
          ? updatePracticesValues(disciplinesPayload)
          : Promise.resolve(),

        hasHabits && lastEntry
          ? updateHabits({
              habitsXpUpdates: habitsXp,
              habitActionsUpdates: lastEntry.habits,
              updateDate: todayDate,
            })
          : Promise.resolve(),
      ]);

      const createNewEntryResponse = await fetch(
        `/api/journal-entry/new?today=${today}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            dailyWillpower: 0,
            bonusWillpower: bonusWillpower ?? 0,
            habits: defaultJournalEntryHabitActionValues,
          }),
          signal,
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
