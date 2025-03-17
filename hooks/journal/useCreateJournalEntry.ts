import { useState } from "react";
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
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    yesterdayEntryError,
    bonusWillpower,
  } = useYesterdayJournalEntry();

  const { habits, habitsLoading, habitsError } = useUserHabits();

  const { updateHabits, updateHabitsSubmitting, updateHabitsError } =
    useUpdateHabits();

  const createJournalEntry = async () => {
    setSubmittingJournalEntry(false);

    try {
      setSubmittingJournalEntry(true);

      // 1. Authentication check
      if (!session?.user.id) {
        throw new Error("AUTHENTICATION_ERROR: User not authenticated");
      }

      // 2. Check yesterday's entry data - FOR WP BONUS
      if (yesterdayEntryLoading) {
        throw new Error(
          "YESTERDAY_ENTRY_LOADING: Yesterday's entry data is still loading"
        );
      }

      if (yesterdayEntryError) {
        throw new Error(`YESTERDAY_ENTRY_ERROR: ${yesterdayEntryError}`);
      }

      // 3. Check user habits data - FOR DEFAULT_JE_HABIT_ACTION_VALUES
      if (habitsLoading) {
        throw new Error("HABITS_LOADING: Habits data is still loading");
      }

      if (habitsError) {
        throw new Error(`HABITS_ERROR: ${habitsError}`);
      }

      // 4. Check last entry data - TO UPDATE THE HABIT XP
      if (lastEntryLoading) {
        throw new Error("LAST_ENTRY_LOADING: Last entry data is still loading");
      }

      if (lastEntryError) {
        throw new Error(`LAST_ENTRY_ERROR: ${lastEntryError}`);
      }

      // 5. Check update habits status - Check for Previous Unfinished Call
      if (updateHabitsSubmitting) {
        throw new Error(
          "UPDATE_HABITS_LOADING: Update habits is still processing"
        );
      }

      if (updateHabitsError) {
        throw new Error(`UPDATE_HABITS_ERROR: ${updateHabitsError}`);
      }

      let bonusWillPowerFormYesterday = 0;
      // Get Bonus WP from yesterday's
      if (yesterdayEntry) bonusWillPowerFormYesterday = bonusWillpower;

      // Generate default habit action values and include current habit XP
      // NOTE: Should return from useUserHabits directly default values!
      let defaultJournalEntryActionValues: JournalEntryHabit = {};
      if (habits && habits.length > 0) {
        defaultJournalEntryActionValues = getHabitActionDefaultValues(habits, {
          includeCurrentXp: true,
        }) as JournalEntryHabit;
      }

      if (Object.keys(defaultJournalEntryActionValues).length === 0) {
        console.warn(
          "No habits with actions found. Using empty object for actions."
        );
      }

      const today = getToday();

      const todayDate = getToday().toISOString().split("T")[0];

      // NOTE: Must not crete entry before updating the Habits XP
      // Update habits if there are actions and XP from the last entry
      if (
        lastEntry?.habits &&
        Object.keys(lastEntry.habits).length > 0 &&
        Object.keys(habitsXp).length > 0
      ) {
        try {
          await updateHabits({
            habitsXpUpdates: habitsXp,
            habitActionsUpdates: lastEntry.habits,
            updateDate: todayDate,
          });
        } catch (updateError) {
          console.error(
            "Error updating habits before entry creation:",
            updateError
          );
          throw new Error(`Failed to update habits: ${updateHabitsError}`);
        }
      }

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
            bonusWillpower: bonusWillPowerFormYesterday,
            habits: defaultJournalEntryActionValues,
          }),
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
      console.error("Error creating new entry:", error);
      setSubmittingJournalEntry(false);
      throw error;
    }
  };

  return { createJournalEntry, submittingJournalEntry };
}
