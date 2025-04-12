import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { Session } from "@models/types";

export function useCreateDiscipline() {
  const { data: session } = useSession() as { data: Session | null };

  const [submittingDiscipline, setSubmittingDiscipline] =
    useState<boolean>(false);
  const [createDisciplineError, setCreateDisciplineError] = useState<
    string | null
  >(null);

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

  // Create Discipline function //maybe rename this.... discipline.name?
  const createDiscipline = async (disciplineStep: DisciplineZodType) => {
    if (!session?.user.id) throw new Error("User not authenticated");

    // Cancel any in-progress creation
    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this operation
    createAbortControllerRef.current = new AbortController();
    const signal = createAbortControllerRef.current.signal;

    setSubmittingDiscipline(true);
    setCreateDisciplineError(null);

    try {
      const { discipline, icon, type, title, description } = disciplineStep;

      const response = await fetch("/api/discipline/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          discipline,
          icon,
          type,
          title,
          description,
        }),
        signal: signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to create discipline");
      }

      //NOTE: should we leave this in?
      const createdDisciplineData = await response.json();

      // NOTE: No need to return data here as the user is redirected on success
      // return createdDisciplineData; // Return the created data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Create operation aborted");
        return;
      }

      console.error("Error creating discipline:", error);
      setCreateDisciplineError(
        (error as Error).message || "Failed to create discipline"
      );
      throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmittingDiscipline(false);
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
    createDiscipline,
    submittingDiscipline,
    createDisciplineError,
    // isAuthenticated: !!session?.user?.id,
  };
}
