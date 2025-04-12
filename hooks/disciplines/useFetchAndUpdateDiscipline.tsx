import { useState, useEffect, useRef } from "react";
import { DisciplineZodType } from "@models/disciplineFormSchema";

export function useFetchAndUpdateDiscipline(id: string) {
  const [submittingDisciplineUpdate, setSubmittingDisciplineUpdate] =
    useState(false);
  const [disciplineData, setDisciplineData] =
    useState<DisciplineZodType | null>(null);
  const [disciplineDataLoading, setDisciplineDataLoading] = useState(true);
  const [disciplineDataError, setDisciplineDataError] = useState<string | null>(
    null
  );
  //NOTE: no error for submitting? or its th same with disciplineDataError?

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

    const getDisciplineData = async () => {
      if (!id) return;

      setDisciplineDataLoading(true);
      try {
        const response = await fetch(`/api/discipline/${id}`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch habit data");
        }

        const data = await response.json();
        setDisciplineData({
          discipline: data.discipline,
          icon: data.icon,
          type: data.type,
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }

        console.error("Error fetching discipline data", error);
        setDisciplineDataError(
          "Failed to load discipline data. Please try again."
        );
      } finally {
        if (!signal.aborted) {
          setDisciplineDataLoading(false);
        }
      }
    };

    getDisciplineData();

    // Cleanup function
    return () => {
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [id]);

  // Update habit function
  const updateDiscipline = async (disciplineStep: DisciplineZodType) => {
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

    setSubmittingDisciplineUpdate(true);
    try {
      const { discipline, icon, type, title, description } = disciplineStep;

      const response = await fetch(`/api/discipline/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discipline,
          icon,
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

      const updatedDisciplineData = await response.json();

      // NOTE: No need to return data here as the user is redirected on success
      // return updatedDisciplineData; // Return the updated data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Update aborted");
        return;
      }

      console.error("Error updating discipline:", error);
      //   throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmittingDisciplineUpdate(false);
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
    disciplineData,
    disciplineDataLoading,
    disciplineDataError,
    updateDiscipline,
    submittingDisciplineUpdate,
  };
}
