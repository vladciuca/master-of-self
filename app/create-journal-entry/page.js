"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import JournalEntryForm from "@components/JournalEntryForm";

const CreateJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const createJournalEntry = async (value) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          gratefulItems: value,
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
    <JournalEntryForm
      //   type="Create"
      submitting={submitting}
      onSubmit={createJournalEntry}
    />
  );
};

export default CreateJournalEntry;
