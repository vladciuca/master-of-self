"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
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

const UpdateJournalEntry = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const response = await fetch(`/api/journal-entry/${params.id}`, {
        method: "GET",
      });
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
        body: JSON.stringify({ ...entry }),
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
    initialData && (
      <div>
        <JournalEntryForm
          type="update"
          session={session}
          submitting={submitting}
          onSubmit={updateJournalEntry}
          initialData={initialData}
        />
      </div>
    )
  );
};

export default UpdateJournalEntry;
