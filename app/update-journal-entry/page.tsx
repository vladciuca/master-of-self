"use client";

import { useState, useEffect } from "react";
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
  day: { myDay: string };
  night: { myNight: string };
}

const UpdateJournalEntry = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const response = await fetch(`/api/journal-entry/${params.id}`);
      const data = await response.json();
      setInitialData(data);
    };
    fetchEntry();
  }, [params.id]);

  const updateJournalEntry = async (entry: JournalEntry) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/journal-entry/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(entry),
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

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <JournalEntryForm
        type="update"
        session={session}
        submitting={submitting}
        onSubmit={updateJournalEntry}
        initialData={initialData}
      />
    </div>
  );
};

export default UpdateJournalEntry;
