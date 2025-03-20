import { useState, useEffect, useRef } from "react";
import { HabitZodType } from "@models/habitFormSchema";

export function useFetchAndUpdateHabit(id: string) {
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<HabitZodType | null>(null);
  const [habitDataLoading, setHabitDataLoading] = useState(true);
  const [habitDataError, setHabitDataError] = useState<string | null>(null);

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

    const getHabitData = async () => {
      if (!id) return;

      setHabitDataLoading(true);
      try {
        const response = await fetch(`/api/habit/${id}`, {
          signal,
        });

        if (signal.aborted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch habit data");
        }

        const data = await response.json();
        setHabitData({
          name: data.name,
          icon: data.icon,
          actions: data.actions,
          xp: data.xp,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }

        console.error("Error fetching habit data", error);
        setHabitDataError("Failed to load habit data. Please try again.");
      } finally {
        if (!signal.aborted) {
          setHabitDataLoading(false);
        }
      }
    };

    getHabitData();

    // Cleanup function
    return () => {
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [id]);

  // Update habit function
  const updateHabit = async (habit: HabitZodType) => {
    if (!id) {
      throw new Error("Habit ID not found");
    }

    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const signal = updateAbortControllerRef.current.signal;

    setSubmitting(true);
    try {
      const { name, icon, actions } = habit;

      const response = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          icon,
          actions,
        }),
        signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      const updatedData = await response.json();
      // NOTE: HERE we will use this data for the HabitSync hook
      return updatedData; // Return the updated data for the caller
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Update aborted");
        return;
      }

      console.error("Error updating habit:", error);
      //   throw error; // Re-throw the error for the caller to handle
    } finally {
      if (!signal.aborted) {
        setSubmitting(false);
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

  // Helper function to calculate default XP values
  const habitDefaultXpValues = (habitData: HabitZodType) => {
    return habitData?.actions.reduce(
      (sum: number, action) =>
        sum + (action.type === "break" ? action.dailyTarget : 0),
      0
    );
  };

  return {
    habitData,
    habitDefaultXpValues,
    habitDataLoading,
    habitDataError,
    updateHabit,
    submitting,
  };
}
