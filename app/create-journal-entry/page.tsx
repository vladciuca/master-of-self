"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import JournalEntryForm from "@components/journal-entry-form/JournalEntryForm";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

interface JournalEntry {
  dailyWillpower: number;
  dayEntry: string[];
  nightEntry: string[];
}

const CreateJournalEntry = ({
  searchParams,
}: {
  searchParams: { time: "day" | "night" };
}) => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { time } = searchParams;

  const createJournalEntry = async (journalEntry: JournalEntry) => {
    const { dailyWillpower, dayEntry, nightEntry } = journalEntry;
    setSubmitting(true);

    try {
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower,
          dayEntry,
        }),
      });

      if (response.ok) {
        router.push("/journal");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <JournalEntryForm
        type="create"
        submitting={submitting}
        onSubmit={createJournalEntry}
        step={1}
      />
    </div>
  );
};

export default CreateJournalEntry;
