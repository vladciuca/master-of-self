// hooks/settings/useUpdateDisciplines.ts
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type { Session, UserDisciplines } from "@models/types";

export function useUpdateDisciplines() {
  const { data: session } = useSession() as { data: Session | null };
  const [submittingDisciplinesUpdate, setSubmittingDisciplinesUpdate] =
    useState(false);
  const [updateDisciplinesError, setUpdateDisciplinesError] = useState<
    string | null
  >(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const updateDisciplines = async (
    disciplineUpdates: Record<string, number>
  ) => {
    if (!session?.user.id) {
      return { success: false, error: "User not authenticated" };
    }

    // Cancel any in-progress update
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setSubmittingDisciplinesUpdate(true);
    setUpdateDisciplinesError(null);

    try {
      const payload = {
        userId: session.user.id,
        disciplines: disciplineUpdates,
      };

      const response = await fetch(
        `/api/users/${session.user.id}/profile/disciplines`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          //   body: JSON.stringify({ disciplines: disciplineUpdates }),
          body: JSON.stringify(payload),
          signal,
        }
      );

      if (signal.aborted) return;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update disciplines");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Update disciplines request was aborted");
        return;
      }

      console.error("Error updating disciplines:", error);
      setUpdateDisciplinesError(
        (error as Error).message || "Failed to update disciplines"
      );
      return { success: false, error: (error as Error).message };
    } finally {
      if (!signal.aborted) {
        setSubmittingDisciplinesUpdate(false);
      }

      // Clear the ref after completion if it's the same controller
      if (
        abortControllerRef.current &&
        signal === abortControllerRef.current.signal
      ) {
        abortControllerRef.current = null;
      }
    }
  };

  return {
    updateDisciplines,
    submittingDisciplinesUpdate,
    updateDisciplinesError,
  };
}
