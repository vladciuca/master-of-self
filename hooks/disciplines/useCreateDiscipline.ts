import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { Session } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";

export function useCreateDiscipline() {
  const { data: session } = useSession() as { data: Session | null };

  const {
    updateDisciplinesValues,
    submittingDisciplinesValuesUpdate,
    updateDisciplinesValuesError,
  } = useUserProfile();

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
      const { discipline, icon, color, type, title, description } =
        disciplineStep;

      const response = await fetch("/api/discipline/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          discipline,
          icon,
          color,
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

      //NOTE: Takes the id from the response and added it to learned discipline list
      const createdDisciplineData = await response.json();

      try {
        await updateDisciplinesValues({
          [String(createdDisciplineData._id)]: 0,
        });
      } catch (error) {
        console.warn("Failed to initialize discipline value:", error);

        // Optional: surface that to your local state/UI
        setCreateDisciplineError(
          (error as Error).message ?? "Something went wrong initializing value"
        );
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Create operation aborted");
        return;
      }

      console.error(
        "Error learning newly created discipline:",
        updateDisciplinesValuesError
      );
      //NOTE: might not need this, might use updateDisciplinesValuesError
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
