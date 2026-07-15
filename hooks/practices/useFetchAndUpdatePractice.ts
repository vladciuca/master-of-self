import { useState, useEffect, useRef } from "react";
import { PracticeZodType } from "@models/practiceFormSchema";

export function useFetchAndUpdatePractice(id: string) {
  const [submittingPracticeUpdate, setSubmittingPracticeUpdate] =
    useState(false);
  const [practiceData, setPracticeData] =
    useState<PracticeZodType | null>(null);
  const [practiceDataLoading, setPracticeDataLoading] = useState(true);
  const [practiceDataError, setPracticeDataError] = useState<string | null>(
    null
  );
  //NOTE: no error for submitting? or its th same with practiceDataError?

  // Refs for abort controllers
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up both abort controllers on unmount
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }

      if (updateAbortControllerRef.current) {
        updateAbortControllerRef.current.abort();
        updateAbortControllerRef.current = null;
      }
    };
  }, []);

  // Fetch habit data
  useEffect(() => {
    // Cancel any in-progress fetch
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
      fetchAbortControllerRef.current = null;
    }

    // Create a new AbortController for this fetch
    fetchAbortControllerRef.current = new AbortController();
    const signal = fetchAbortControllerRef.current.signal;

    const getPracticeData = async () => {
      if (!id) return;

      setPracticeDataLoading(true);
      try {
        const response = await fetch(`/api/practice/${id}`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch habit data");
        }

        const data = await response.json();
        setPracticeData({
          discipline: data.discipline,
          icon: data.icon,
          color: data.color,
          type: data.type,
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.warn("Fetch aborted");
          return;
        }

        console.error("Error fetching discipline data", error);
        setPracticeDataError(
          "Failed to load discipline data. Please try again."
        );
      } finally {
        if (!signal.aborted) {
          setPracticeDataLoading(false);
        }
      }
    };

    getPracticeData();

    // Cleanup function
    return () => {
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [id]);

  // Update habit function
  const updatePractice = async (practiceStep: PracticeZodType) => {
    if (!id) {
      throw new Error("Discipline ID not found");
    }

    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const signal = updateAbortControllerRef.current.signal;

    setSubmittingPracticeUpdate(true);
    try {
      const { discipline, icon, color, type, title, description } =
        practiceStep;

      const response = await fetch(`/api/practice/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discipline,
          icon,
          color,
          type,
          title,
          description,
        }),
        signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update discipline");
      }

      const updatedPracticeData = await response.json();

      // NOTE: No need to return data here as the user is redirected on success
      // return updatedPracticeData; // Return the updated data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.warn("Update aborted");
        return;
      }

      console.error("Error updating discipline:", error);
      //   throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmittingPracticeUpdate(false);
      }

      // Clear the ref after completion
      if (
        updateAbortControllerRef.current &&
        signal === updateAbortControllerRef.current.signal
      ) {
        updateAbortControllerRef.current = null;
      }
    }
  };

  return {
    practiceData,
    practiceDataLoading,
    practiceDataError,
    updatePractice,
    submittingPracticeUpdate,
  };
}
