import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { User } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";

export function useCreateDiscipline() {
  const { user } = useUser() as { user: User | null };

  const {
    updateDisciplinesValues,
    submittingDisciplinesValuesUpdate,
    updateDisciplinesValuesError,
    updateActiveDiscipline,
  } = useUserProfile();

  const [submittingDiscipline, setSubmittingDiscipline] =
    useState<boolean>(false);
  const [createDisciplineError, setCreateDisciplineError] = useState<
    string | null
  >(null);

  const createAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (createAbortControllerRef.current) {
        createAbortControllerRef.current.abort();
        createAbortControllerRef.current = null;
      }
    };
  }, []);

  const createDiscipline = async (disciplineStep: DisciplineZodType) => {
    if (!user?.id) throw new Error("User not authenticated");

    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

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
          userId: user.id,
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

      const createdDisciplineData = await response.json();
      const disciplineId = String(createdDisciplineData._id);

      try {
        const addResult = await updateDisciplinesValues({
          [disciplineId]: 0,
        });

        if (addResult?.success) {
          await updateActiveDiscipline(disciplineId, true);
        } else {
          console.warn("Discipline created but failed to initialize value");
          setCreateDisciplineError(
            "Discipline created but failed to initialize"
          );
        }
      } catch (error) {
        console.warn("Failed to initialize or activate discipline:", error);
        setCreateDisciplineError(
          (error as Error).message ??
            "Something went wrong initializing discipline"
        );
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Create operation aborted");
        return;
      }

      console.error("Error creating discipline:", error);
      setCreateDisciplineError(
        (error as Error).message || "Failed to create discipline"
      );
      throw error;
    } finally {
      if (!signal.aborted) {
        setSubmittingDiscipline(false);
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
    createDiscipline,
    submittingDiscipline,
    createDisciplineError,
  };
}
