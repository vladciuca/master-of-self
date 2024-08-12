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
  dayEntry: { myDay: string };
  nightEntry: { myNight: string };
}

const CreateJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState(false);

  const createJournalEntry = async (entry: JournalEntry) => {
    const { dailyWillpower, dayEntry, nightEntry } = entry;
    setSubmitting(true);

    try {
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          dailyWillpower,
          dayEntry,
          nightEntry,
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
        session={session}
        submitting={submitting}
        onSubmit={createJournalEntry}
      />
    </div>
  );
};

export default CreateJournalEntry;
