"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import JournalForm from "@components/JournalForm";

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

const CreateJournalEntry = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState(false);

  const createJournalEntry = async (
    gratefulItems: any,
    habitWillpower: any
  ) => {
    console.log("===", gratefulItems, habitWillpower);
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

  const updateHabitResource = async (value: any) => {
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
