import { useState } from "react";
import { useSession } from "next-auth/react";
import { getToday, getTomorrow } from "@lib/time";
import { Session } from "@app/types/types";
import { useLastJournalEntry } from "./useLastJournalEntry";
import { useUpdateHabits } from "./useUpdateHabits";

export function useCreateJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };
  const { lastEntry, lastEntryLoading, bonusWillpower, habitsXp } =
    useLastJournalEntry();
  const { updateHabits, isLoading, error } = useUpdateHabits();

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

        //habit update logic here
        const todayDate = getToday().toISOString().split("T")[0];

        if (
          lastEntry?.nightEntry?.actions &&
          Object.keys(lastEntry.nightEntry.actions).length > 0 &&
          Object.keys(habitsXp).length > 0
        ) {
          await updateHabits({
            habitsXpUpdates: habitsXp,
            habitActionsUpdates: lastEntry.nightEntry.actions,
            updateDate: todayDate,
          });
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

  return { createJournalEntry, submitting };
}
