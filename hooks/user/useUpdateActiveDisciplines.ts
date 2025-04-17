import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "@models/types";

//NOTE: name this to handleActiveDisciplines hook?
export function useUpdateActiveDisciplines() {
  const { data: session } = useSession() as { data: Session | null };
  const [activeDisciplines, setActiveDisciplines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch active disciplines on mount
  useEffect(() => {
    if (session?.user.id) {
      loadActiveDisciplines();
    }
  }, [session?.user.id]);

  const loadActiveDisciplines = async () => {
    if (!session?.user.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/users/${session.user.id}/disciplines/active-disciplines`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch active disciplines"
        );
      }

      const data = await response.json();
      setActiveDisciplines(data.activeDisciplines || []);
    } catch (error) {
      console.error("Error loading active disciplines:", error);
      setError((error as Error).message || "Failed to load active disciplines");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActiveDiscipline = useCallback(
    async (disciplineId: string, isActive: boolean) => {
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

      setIsLoading(true);
      setError(null);

      try {
        const action = isActive ? "add" : "remove";

        const response = await fetch(
          `/api/users/${session.user.id}/disciplines/active-disciplines`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              disciplineId,
              action,
            }),
            signal,
          }
        );

        if (signal.aborted) return;

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to update active discipline"
          );
        }

        const result = await response.json();

        // Update the local state
        setActiveDisciplines(result.activeDisciplines);

        return { success: true, data: result };
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Update active discipline request was aborted");
          return;
        }

        console.error("Error updating active discipline:", error);
        setError(
          (error as Error).message || "Failed to update active discipline"
        );
        return { success: false, error: (error as Error).message };
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }

        // Clear the ref after completion if it's the same controller
        if (
          abortControllerRef.current &&
          signal === abortControllerRef.current.signal
        ) {
          abortControllerRef.current = null;
        }
      }
    },
    [session?.user.id]
  );

  // Check if a discipline is active
  const isDisciplineActive = useCallback(
    (disciplineId: string) => {
      return activeDisciplines.includes(disciplineId);
    },
    [activeDisciplines]
  );

  return {
    activeDisciplines,
    isLoading,
    error,
    toggleActiveDiscipline,
    isDisciplineActive,
    refreshActiveDisciplines: loadActiveDisciplines,
  };
}
