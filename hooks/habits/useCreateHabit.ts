import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { HabitZodType } from "@models/habitFormSchema";
import { Session } from "@models/types";

export function useCreateHabit() {
  // NOTE: do I need the user data here? / and why don't I use it in useCreateJournal
  const { data: session } = useSession() as { data: Session | null };

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Ref for abort controller
  const createAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  // NOTE: move this to top of the file
  // also check with other components that use abort.ref to make this func consistent
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
    // Cancel any in-progress creation
    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this operation
    createAbortControllerRef.current = new AbortController();
    const signal = createAbortControllerRef.current.signal;

    setSubmitting(true);
    setCreateError(null);

    try {
      const { name, icon, actions } = habit;

      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

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

      const createdData = await response.json();
      return createdData; // Return the created data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Create operation aborted");
        return;
      }

      console.error("Error creating habit:", error);
      setCreateError((error as Error).message || "Failed to create habit");
      //   throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmitting(false);
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
    submitting,
    createError,
    isAuthenticated: !!session?.user?.id,
  };
}
