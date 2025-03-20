import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { HabitActionUpdate, HabitUpdate } from "@models/mongodb";
import type { Session, JournalEntryHabitActions } from "@models/types";

type UpdateHabitsProps = {
  habitsXpUpdates: JournalEntryHabitActions;
  habitActionsUpdates: HabitActionUpdate;
  updateDate: string;
};

export function useUpdateHabits() {
  const { data: session } = useSession() as { data: Session | null };

  const [updateHabitsSubmitting, setUpdateHabitsSubmitting] = useState(false);
  const [updateHabitsError, setUpdateHabitsError] = useState<string | null>(
    null
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function to abort fetch requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const updateHabits = async ({
    habitsXpUpdates,
    habitActionsUpdates,
    updateDate,
  }: UpdateHabitsProps) => {
    if (!session?.user.id)
      return { status: "error", message: "User not authenticated" };

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setUpdateHabitsSubmitting(true);
    setUpdateHabitsError(null);

    try {
      const payload = {
        userId: session.user.id,
        habitXpUpdates: Object.entries(habitsXpUpdates) as HabitUpdate[],
        habitActionsUpdates: habitActionsUpdates,
        updateDate: updateDate,
      };

      const response = await fetch(
        `/api/users/${session.user.id}/habits/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal,
        }
      );

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update habits");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Fetch request was aborted");
        return;
      }

      console.error("Error updating habits:", error);
      setUpdateHabitsError("Failed to update habit XP");
      throw error;
    } finally {
      // Unlike GET requests, there’s no risk of an inconsistent UI caused by setting submitting = false after an abort.
      // NOTE: added it for consistency, might remove it in the future
      if (!signal.aborted) {
        setUpdateHabitsSubmitting(false);
      }
    }
  };

  return { updateHabits, updateHabitsSubmitting, updateHabitsError };
}
