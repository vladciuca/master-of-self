import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getToday } from "@lib/time";
import { Session, JournalEntryMetadata } from "@models/types";

export function useTodayJournalEntry() {
  const { data: session } = useSession() as { data: Session | null };

  const [todayEntry, setTodayEntry] = useState<JournalEntryMetadata | null>(
    null
  );
  const [todayEntryLoading, setTodayEntryLoading] = useState(false);
  const [todayEntryError, setTodayEntryError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setTodayEntryError(null);
    setTodayEntryLoading(true);

    const getTodayEntry = async () => {
      try {
        const today = getToday();
        const url = `/api/users/${session?.user.id}/journal-entries/today?today=${today}`;

        const todayEntryResponse = await fetch(url, { signal });

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

    if (session?.user.id) {
      getTodayEntry();
    }

    return () => {
      abortController.abort();
    };
  }, [session?.user.id]);

  return {
    todayEntry,
    todayEntryLoading,
    todayEntryError,
  };
}
