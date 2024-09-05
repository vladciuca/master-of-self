"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JournalEntryList from "@components/journal/JournalEntryList";
import SkeletonJournalEntryCard from "@components/skeletons/SkeletonJournalEntryCard";
import { JournalEntry } from "@components/journal/journal-entry-form/FormStepController";
import { Session } from "@/app/types/types";

export interface JournalEntryProps extends JournalEntry {
  _id: string;
  createDate: Date;
  creator?: {
    _id: string;
  };
}

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonJournalEntryCard key={index} />
));

const UserJournal = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [journalEntries, setJournalEntries] = useState([]);
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

  const handleDelete = async (journalEntry: JournalEntryProps) => {
    const hasConfirmed = confirm("Are you sure you want to delete this habit?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/journal-entry/${journalEntry._id.toString()}`, {
          method: "DELETE",
        });

        const filteredJournalEntries = journalEntries.filter(
          (myJournalEntry: JournalEntryProps) =>
            myJournalEntry._id !== journalEntry._id
        );

        setJournalEntries(filteredJournalEntries);

        router.push("/journal");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {!journalEntriesLoaded && <>{skeletonCards}</>}
      {journalEntriesLoaded && (
        <div>
          <JournalEntryList
            journalEntries={journalEntries}
            handleDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
};

export default UserJournal;
