import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateJournalEntryHabits } from "@hooks/journal/useUpdateJournalEntryHabits";
import { HabitZodType } from "@models/habitFormSchema";
import { Session } from "@models/types";

export function useCreateHabit() {
  const { data: session } = useSession() as { data: Session | null };

  const [submittingHabit, setSubmittingHabit] = useState<boolean>(false);
  const [createHabitError, setCreateHabitError] = useState<string | null>(null);

  const {
    updateJournalEntryHabits,
    //NOTE: these can be returned from this hook separately
    // submittingJournalHabitsUpdate,
    // updateJournalHabitsError,
  } = useUpdateJournalEntryHabits();

  // Ref for abort controller
  const createAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (createAbortControllerRef.current) {
        createAbortControllerRef.current.abort();
        createAbortControllerRef.current = null;
      }
    };
  }, []);

  // Create habit function
  const createHabit = async (habit: HabitZodType) => {
    if (!session?.user.id) throw new Error("User not authenticated");

    // Cancel any in-progress creation
    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this operation
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
          userId: session.user.id,
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

      //NOTE: Able to still create a Habit if no TodayEntryExists
      await updateJournalEntryHabits(createdHabitData);

      // NOTE: No need to return data here as the user is redirected on success
      // return createdHabitData; // Return the created data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Create operation aborted");
        return;
      }

      console.error("Error creating habit:", error);
      setCreateHabitError((error as Error).message || "Failed to create habit");
      throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmittingHabit(false);
      }

      // Clear the ref after completion
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
    // isAuthenticated: !!session?.user?.id,
  };
}
