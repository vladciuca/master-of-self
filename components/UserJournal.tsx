"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JournalEntryList from "@components/JournalEntryList";
import SkeletonJournalEntryCard from "@components/skeletons/SkeletonJournalEntryCard";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonJournalEntryCard key={index} />
));

const UserJournal = () => {
  const { data: session } = useSession() as { data: Session | null };
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

  return (
    <div>
      {!journalEntriesLoaded && <>{skeletonCards}</>}
      {journalEntriesLoaded && (
        <div>
          <JournalEntryList journalEntries={journalEntries} />
        </div>
      )}
    </div>
  );
};

export default UserJournal;
