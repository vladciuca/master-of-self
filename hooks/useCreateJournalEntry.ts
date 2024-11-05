import { useState } from "react";
import { useSession } from "next-auth/react";
import { getToday, getTomorrow } from "@lib/time";
import { Session } from "@app/types/types";
import { useYesterdayJournalEntry } from "./useYesterdayJournalEntry";

export function useCreateJournalEntry() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data: session } = useSession() as { data: Session | null };
  const { bonusWillpower } = useYesterdayJournalEntry();

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
