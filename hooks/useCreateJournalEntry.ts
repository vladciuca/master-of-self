import { useState } from "react";
import { useSession } from "next-auth/react";
import { Session, JournalEntryHabit } from "@models/types";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";
import { useLastJournalEntry } from "./useLastJournalEntry";
import { useUpdateHabits } from "./useUpdateHabits";
import { useUserHabits } from "@hooks/useUserHabits";
import {
  getToday,
  // getTomorrow
} from "@lib/time";
import { getHabitActionDefaultValues } from "@lib/level";

export function useCreateJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };

  const { lastEntry, lastEntryLoading, bonusWillpower, habitsXp } =
    useLastJournalEntry();
  const { yesterdayEntry } = useYesterdayJournalEntry();
  const { updateHabits, isLoading, error } = useUpdateHabits();
  const { habits, habitsLoading, habitsError } = useUserHabits();

  const createJournalEntry = async () => {
    setSubmitting(false);

    try {
      setSubmitting(true);

      if (!session?.user.id) {
        throw new Error("User not authenticated");
      }

      if (habitsLoading) {
        throw new Error("Habits are still loading");
      }

      if (habitsError) {
        throw new Error("Error loading habits");
      }

      const today = getToday();
      // const tomorrow = getTomorrow();

      let bonusWillPowerFormYesterday = 0;
      if (yesterdayEntry) bonusWillPowerFormYesterday = bonusWillpower;

      // Generate default habit action values and include current habit XP
      let defaultJournalEntryActionValues: JournalEntryHabit = {};
      if (!isLoading && habits && habits.length > 0) {
        defaultJournalEntryActionValues = getHabitActionDefaultValues(habits, {
          includeCurrentXp: true,
        }) as JournalEntryHabit;
      }

      if (Object.keys(defaultJournalEntryActionValues).length === 0) {
        console.warn(
          "No habits with actions found. Using empty object for actions."
        );
      }

      const createNewEntryResponse = await fetch(
        // `/api/journal-entry/new?today=${today}&tomorrow=${tomorrow}`,
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

      // Update habits if there are actions and XP from the last entry
      const todayDate = getToday().toISOString().split("T")[0];

      if (
        lastEntry?.habits &&
        Object.keys(lastEntry.habits).length > 0 &&
        Object.keys(habitsXp).length > 0
      ) {
        await updateHabits({
          habitsXpUpdates: habitsXp,
          habitActionsUpdates: lastEntry.habits,
          updateDate: todayDate,
        });
      }

      return newEntry._id;
    } catch (error) {
      console.error("Error creating new entry:", error);
      setSubmitting(false);
      throw error;
    }
  };

  return { createJournalEntry, submitting };
}
