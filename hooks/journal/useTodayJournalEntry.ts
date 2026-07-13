import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getToday } from "@lib/time";
import { User, JournalEntryMetadata } from "@models/types";

export function useTodayJournalEntry() {
  const { user } = useUser() as { user: User | null };

  const [todayEntry, setTodayEntry] = useState<JournalEntryMetadata | null>(
    null
  );
  const [todayEntryLoading, setTodayEntryLoading] = useState(false);
  const [todayEntryError, setTodayEntryError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setTodayEntryError(null);
    setTodayEntryLoading(true);

    const getTodayEntry = async () => {
      try {
        const today = getToday();
        const url = `/api/users/${user.id}/journal-entries/today?today=${today}`;

        const todayEntryResponse = await fetch(url, { signal });

        if (signal.aborted) return;

        if (!todayEntryResponse.ok) {
          console.error(
            `Error fetching todays's entry: ${todayEntryResponse.status}`
          );
          return;
        }

        const responseData = await todayEntryResponse.json();
        const entry = responseData?.todaysJournalEntry ?? null;

        setTodayEntry(entry);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch today's journal entry", error);
        setTodayEntryError("Failed to fetch today's journal entry");
      } finally {
        if (!signal.aborted) {
          setTodayEntryLoading(false);
        }
      }
    };

    getTodayEntry();

    return () => {
      abortController.abort();
    };
  }, [user?.id]);

  return {
    todayEntry,
    todayEntryLoading,
    todayEntryError,
  };
}
