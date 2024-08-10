"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { User, Session } from "next-auth";
import JournalEntryForm from "@components/journal-entry-form/JournalEntryForm";
// import JournalForm from "@components/JournalForm";

// Define the types for user and session
interface User {
  id: string;
  name?: string;
  email?: string;
  // Add other properties you expect in the user object
}

interface Session {
  user: User;
  // Add other properties you expect in the session object
}

const UpdateJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState(false);

  const updateJournalEntry = async (
    id: string,
    type: "day" | "night",
    dailyWillpower: number,
    dayEntry: object,
    nightEntry: object
  ) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          id,
          type,
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
        type="update"
        session={session}
        submitting={submitting}
        onSubmit={updateJournalEntry}
      />
    </div>
  );
};

export default UpdateJournalEntry;
