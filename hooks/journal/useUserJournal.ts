import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, JournalEntryMetadata } from "@models/types";

export function useUserJournal() {
  const { data: session } = useSession() as { data: Session | null };

  const [journalEntries, setJournalEntries] = useState<JournalEntryMetadata[]>(
    []
  );
  const [journalEntriesLoading, setJournalEntriesLoading] = useState(false);
  const [journalEntriesError, setJournalEntriesError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!session?.user.id) return;

    const abortController = new AbortController();
    const signal = abortController.signal;

    setJournalEntriesError(null);
    setJournalEntriesLoading(true);

    const fetchJournalEntries = async () => {
      try {
        const journalEntriesResponse = await fetch(
          `/api/users/${session?.user?.id}/journal-entries`,
          { signal }
        );

        if (signal.aborted) return;

        if (!journalEntriesResponse.ok) {
          console.error(
            `Error fetching journal entries: ${journalEntriesResponse.status}`
          );
          return;
        }

        const { journalEntries } = await journalEntriesResponse.json();

        setJournalEntries(journalEntries.reverse());
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Failed to fetch journal entries", error);
        setJournalEntriesError("Failed to fetch journal entries");
      } finally {
        if (!signal.aborted) {
          setJournalEntriesLoading(false);
        }
      }
    };

    fetchJournalEntries();

    return () => {
      abortController.abort();
    };
  }, [session]);

  return { journalEntries, journalEntriesLoading, journalEntriesError };
}
