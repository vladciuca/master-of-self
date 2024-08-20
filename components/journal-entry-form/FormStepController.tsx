"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageLogo from "@components/PageLogo";

interface Session {
  user?: {
    id?: string | null;
  };
}

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
};

const StepFormController = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [journalEntries, setJournalEntries] = useState<JournalEntryProps[]>([]);
  const [journalEntriesLoaded, setJournalEntriesLoaded] = useState(false);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      setJournalEntriesLoaded(false);
      try {
        const response = await fetch(
          `/api/users/${session?.user?.id}/journal-entries`
        );
        const data = await response.json();
        setJournalEntries(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setJournalEntriesLoaded(true);
      }
    };

    if (session?.user?.id) {
      fetchJournalEntries();
    }
  }, [session]);

  useEffect(() => {
    const todaysEntry = journalEntries.find((entry) => {
      const entryDate = new Date(entry.createDate);
      const currentDate = new Date();
      return (
        entryDate.toLocaleDateString() === currentDate.toLocaleDateString()
      );
    });

    if (todaysEntry?._id === undefined) {
      return;
    }
    router.push(`/update-journal-entry/${todaysEntry?._id}`);
  }, [journalEntriesLoaded]);

  return <PageLogo />;
};

export default StepFormController;
