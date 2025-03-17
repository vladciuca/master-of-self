import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import type {
  Session,
  JournalEntry,
  JournalEntryHabitActions,
} from "@models/types";

export function useLastJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };

  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);
  const [lastEntryLoading, setLastEntryLoading] = useState(false);
  const [lastEntryError, setLastEntryError] = useState<string | null>(null);

  const [habitsXp, setHabitsXp] = useState<JournalEntryHabitActions>({});

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const getLastEntry = async () => {
      setLastEntryError(null);
      setLastEntryLoading(true);

      try {
        const url = `/api/users/${session.user.id}/journal-entries/last`;
        const lastEntryResponse = await fetch(url, { signal });

        if (!lastEntryResponse.ok) {
          throw new Error(
            `Error fetching last entry: ${lastEntryResponse.status}`
          );
        }

        const responseData = await lastEntryResponse.json();
        const entry = responseData?.lastJournalEntry ?? null;
        setLastEntry(entry);

        if (!entry) return;

        const habits = entry.habits || {};
        const totalWillpower =
          (entry.dailyWillpower || 0) + (entry.bonusWillpower || 0);

        // Calculate and set habits XP
        if (
          !habits ||
          typeof habits !== "object" ||
          Object.keys(habits).length === 0
        )
          return;

        const currentHabitsXp = calculateHabitsXpFromEntry({
          entryHabits: habits,
          entryWillpower: totalWillpower,
        });
        setHabitsXp(currentHabitsXp);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch last journal entry", error);
        setLastEntryError("Failed to fetch last journal entry");
        // Reset state
        setHabitsXp({});
      } finally {
        setLastEntryLoading(false);
      }
    };

    getLastEntry();

    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    lastEntry,
    lastEntryLoading,
    lastEntryError,
    habitsXp,
  };
}
