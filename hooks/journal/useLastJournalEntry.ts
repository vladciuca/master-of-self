import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { calculateHabitsXpFromEntry } from "@/lib/level";
import type { Session, JournalEntry } from "@models/types";

export function useLastJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };

  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);
  const [lastEntryLoading, setLastEntryLoading] = useState(false);
  const [lastEntryError, setLastEntryError] = useState<string | null>(null);

  // Calculate habitsXp as a derived value using useMemo
  const habitsXp = useMemo(() => {
    if (!lastEntry) return {};

    const habits = lastEntry.habits || {};
    const totalWillpower =
      (lastEntry.dailyWillpower || 0) + (lastEntry.bonusWillpower || 0);

    if (
      !habits ||
      typeof habits !== "object" ||
      Object.keys(habits).length === 0
    )
      return {};

    return calculateHabitsXpFromEntry({
      entryHabits: habits,
      entryWillpower: totalWillpower,
    });
  }, [lastEntry]);

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setLastEntryError(null);
    setLastEntryLoading(true);

    const getLastEntry = async () => {
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
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch last journal entry", error);
        setLastEntryError("Failed to fetch last journal entry");
      } finally {
        if (!signal.aborted) {
          setLastEntryLoading(false);
        }
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
