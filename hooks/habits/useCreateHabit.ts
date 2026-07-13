import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUpdateJournalEntryHabits } from "@hooks/journal/useUpdateJournalEntryHabits";
import { HabitZodType } from "@models/habitFormSchema";
import { User } from "@models/types";

export function useCreateHabit() {
  const { user } = useUser() as { user: User | null };

  const [submittingHabit, setSubmittingHabit] = useState<boolean>(false);
  const [createHabitError, setCreateHabitError] = useState<string | null>(null);

  const {
    updateJournalEntryHabits,
  } = useUpdateJournalEntryHabits();

  const createAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (createAbortControllerRef.current) {
        createAbortControllerRef.current.abort();
        createAbortControllerRef.current = null;
      }
    };
  }, []);

  const createHabit = async (habit: HabitZodType) => {
    if (!user?.id) throw new Error("User not authenticated");

    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

    createAbortControllerRef.current = new AbortController();
    const signal = createAbortControllerRef.current.signal;

    setSubmittingHabit(true);
    setCreateHabitError(null);

    try {
      const { name, icon, actions } = habit;

      const response = await fetch("/api/habit/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          icon,
          xp: 0,
          actions,
        }),
        signal: signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to create habit");
      }

      const createdHabitData = await response.json();

      await updateJournalEntryHabits(createdHabitData);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Create operation aborted");
        return;
      }

      console.error("Error creating habit:", error);
      setCreateHabitError((error as Error).message || "Failed to create habit");
      throw error;
    } finally {
      if (!signal.aborted) {
        setSubmittingHabit(false);
      }

      if (
        createAbortControllerRef.current &&
        signal === createAbortControllerRef.current.signal
      ) {
        createAbortControllerRef.current = null;
      }
    }
  };

  return {
    createHabit,
    submittingHabit,
    createHabitError,
  };
}
