import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { HabitActionUpdate, HabitUpdate } from "@models/mongodb";
import type { User, JournalEntryHabitActions } from "@models/types";

type UpdateHabitsProps = {
  habitsXpUpdates: JournalEntryHabitActions;
  habitActionsUpdates: HabitActionUpdate;
  updateDate: string;
};

export function useUpdateHabits() {
  const { user } = useUser() as { user: User | null };

  const [submittingHabitsUpdate, setSubmittingHabitsUpdate] = useState(false);
  const [updateHabitsError, setUpdateHabitsError] = useState<string | null>(
    null
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const updateHabits = async ({
    habitsXpUpdates,
    habitActionsUpdates,
    updateDate,
  }: UpdateHabitsProps) => {
    if (!user?.id)
      return { status: "error", message: "User not authenticated" };

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setSubmittingHabitsUpdate(true);
    setUpdateHabitsError(null);

    try {
      const payload = {
        userId: user.id,
        habitXpUpdates: Object.entries(habitsXpUpdates) as HabitUpdate[],
        habitActionsUpdates: habitActionsUpdates,
        updateDate: updateDate,
      };

      const response = await fetch(
        `/api/users/${user.id}/habits/update`,
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
      if (!signal.aborted) {
        setSubmittingHabitsUpdate(false);
      }
    }
  };

  return { updateHabits, submittingHabitsUpdate, updateHabitsError };
}
