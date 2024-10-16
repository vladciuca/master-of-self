import { useState } from "react";
import { useSession } from "next-auth/react";
import { getToday, getTomorrow } from "@lib/time";
import { Session } from "@app/types/types";
import { HabitActionUpdate } from "@app/types/mongodb";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";

export function useCreateJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };
  const { yesterdayEntry, bonusWillpower, habitsXp } =
    useYesterdayJournalEntry();

  const createJournalEntry = async () => {
    setSubmitting(false);

    try {
      setSubmitting(true);
      const today = getToday();
      const tomorrow = getTomorrow();

      const createNewEntryResponse = await fetch(
        `/api/journal-entry/new?today=${today}&tomorrow=${tomorrow}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user.id,
            dailyWillpower: bonusWillpower,
            bonusWillpower: bonusWillpower,
          }),
        }
      );

      if (createNewEntryResponse.ok) {
        const newEntry = await createNewEntryResponse.json();

        if (Object.keys(habitsXp).length > 0) {
          await updateHabitXP(habitsXp);
        }

        if (
          yesterdayEntry?.nightEntry?.actions &&
          Object.keys(yesterdayEntry.nightEntry.actions).length > 0
        ) {
          await updateHabitActions(yesterdayEntry.nightEntry.actions);
        }

        if (newEntry?._id) {
          return newEntry._id;
        } else {
          throw new Error("Failed to create new entry: No _id returned");
        }
      } else {
        const errorData = await createNewEntryResponse.json();
        throw new Error(`Failed to create new entry: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating new entry:", error);
      throw error;
    }
  };

  //To move to own hook and chron
  const updateHabitXP = async (habits: { [key: string]: number }) => {
    try {
      const habitUpdates = Object.entries(habits);
      const response = await fetch(
        `/api/users/${session?.user.id}/habits/updateXp`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(habitUpdates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habits");
      }
    } catch (error) {
      console.error("Error updating habits:", error);
      throw error;
    }
  };

  //To move to own hook and chron
  const updateHabitActions = async (habitActionUpdates: HabitActionUpdate) => {
    try {
      const response = await fetch(
        `/api/users/${session?.user.id}/habits/updateActions`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(habitActionUpdates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update habit actions");
      }

      const data = await response.json();
      return data.habits;
    } catch (error) {
      console.error("Error updating habit actions:", error);
      throw error;
    }
  };

  return { createJournalEntry, submitting };
}
