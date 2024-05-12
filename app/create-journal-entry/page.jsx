"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import JournalForm from "@components/JournalForm";

const CreateJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const createJournalEntry = async (gratefulItems, habitWillpower) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/journal-entry/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          gratefulItems: gratefulItems,
          habitWillpower: habitWillpower,
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

  const updateHabitResource = async (value) => {
    const { habitId, resource } = value;

    setSubmitting(true);

    if (!habitId) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${habitId}/resource`, {
        method: "PATCH",
        body: JSON.stringify({
          resource: resource,
        }),
      });

      // if (response.ok) {
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <JournalForm
      //   type="Create"
      session={session}
      submitting={submitting}
      onSubmit={createJournalEntry}
      updateHabit={updateHabitResource}
    />
  );
};

export default CreateJournalEntry;
