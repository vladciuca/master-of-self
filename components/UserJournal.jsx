"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JournalEntryCard from "./JournalEntryCard";

const UserJournal = () => {
  const { data: session } = useSession();
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalEntriesLoaded, setJournalEntriesLoaded] = useState(false);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      setJournalEntriesLoaded(false);
      try {
        const response = await fetch(
          `/api/users/${session?.user.id}/journal-entries`
        );
        const data = await response.json();
        setJournalEntries(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setJournalEntriesLoaded(true);
      }
    };

    if (session?.user.id) {
      fetchJournalEntries();
    }
  }, [session]);

  useEffect(() => {
    console.log("===journalEntries", journalEntries);
  }, [journalEntries]);

  return (
    <div>
      <JournalEntryCard journalEntries={journalEntries} />
    </div>
  );
};

export default UserJournal;
