import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session, JournalEntryMetadata } from "@app/types/types";

export function useUserJournal() {
  const [journalEntries, setJournalEntries] = useState<JournalEntryMetadata[]>(
    []
  );
  const [journalEntriesLoading, setJournalEntriesLoading] = useState(false);
  const [journalEntriesError, setJournalEntriesError] = useState<string | null>(
    null
  );
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchJournalEntries = async () => {
      setJournalEntriesError(null);
      setJournalEntriesLoading(true);
      try {
        const response = await fetch(
          `/api/users/${session?.user?.id}/journal-entries`
        );
        const { journalEntries } = await response.json();
        if (!journalEntries) return;
        setJournalEntries(journalEntries.reverse());
      } catch (error) {
        console.error("Failed to fetch journal entries", error);
        setJournalEntriesError("Failed to fetch journal entries");
      } finally {
        setJournalEntriesLoading(false);
      }
    };

    if (session?.user.id) {
      fetchJournalEntries();
    }
  }, [session]);

  return { journalEntries, journalEntriesLoading, journalEntriesError };
}
