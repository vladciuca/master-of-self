import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { PracticeZodType } from "@models/practiceFormSchema";
import { User } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";

export function useCreatePractice() {
  const { user } = useUser() as { user: User | null };

  const {
    updatePracticesValues,
    submittingPracticesValuesUpdate,
    updatePracticesValuesError,
    updateActivePractice,
  } = useUserProfile();

  const [submittingPractice, setSubmittingPractice] =
    useState<boolean>(false);
  const [createPracticeError, setCreatePracticeError] = useState<
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

  const createPractice = async (practiceStep: PracticeZodType) => {
    if (!user?.id) throw new Error("User not authenticated");

    if (createAbortControllerRef.current) {
      createAbortControllerRef.current.abort();
    }

    createAbortControllerRef.current = new AbortController();
    const signal = createAbortControllerRef.current.signal;

    setSubmittingPractice(true);
    setCreatePracticeError(null);

    try {
      const { discipline, icon, color, type, title, description } =
        practiceStep;

      const response = await fetch("/api/practice/new", {
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
        throw new Error("Failed to create practice");
      }

      const createdPracticeData = await response.json();
      const practiceId = String(createdPracticeData._id);

      try {
        const addResult = await updatePracticesValues({
          [practiceId]: 0,
        });

        if (addResult?.success) {
          await updateActivePractice(practiceId, true);
        } else {
          console.warn("Practice created but failed to initialize value");
          setCreatePracticeError(
            "Practice created but failed to initialize"
          );
        }
      } catch (error) {
        console.warn("Failed to initialize or activate practice:", error);
        setCreatePracticeError(
          (error as Error).message ??
            "Something went wrong initializing practice"
        );
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Create operation aborted");
        return;
      }

      console.error("Error creating practice:", error);
      setCreatePracticeError(
        (error as Error).message || "Failed to create practice"
      );
      throw error;
    } finally {
      if (!signal.aborted) {
        setSubmittingPractice(false);
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
    createPractice,
    submittingPractice,
    createPracticeError,
  };
}
