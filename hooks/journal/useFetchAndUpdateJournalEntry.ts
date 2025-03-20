import { useState, useEffect, useRef } from "react";
import { JournalEntry } from "@models/types";

export function useFetchAndUpdateJournalEntry(id: string) {
  const [submitting, setSubmitting] = useState(false);
  const [journalEntryData, setJournalEntryData] = useState<JournalEntry | null>(
    null
  );
  const [journalEntryLoading, setJournalEntryLoading] = useState(false);
  const [journalEntryError, setJournalEntryError] = useState<string | null>(
    null
  );

  // Refs for abort controllers
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const updateAbortControllerRef = useRef<AbortController | null>(null);

  // Fetch journal entry data
  useEffect(() => {
    // Cancel any in-progress fetch
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this fetch
    fetchAbortControllerRef.current = new AbortController();
    const signal = fetchAbortControllerRef.current.signal;

    const getJournalEntryData = async () => {
      setJournalEntryLoading(true);
      try {
        const response = await fetch(`/api/journal-entry/${id}`, {
          method: "GET",
          signal: signal,
        });

        // NOTE: might add this early exit to all hooks
        if (signal.aborted) return; // Exit if aborted during fetch

        if (!response.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        const data = await response.json();
        setJournalEntryData(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Fetch aborted");
          return; // Don't update state if aborted
        }

        console.error("Error fetching journal entry:", error);
        setJournalEntryError("Failed to load journal entry. Please try again.");
      } finally {
        if (!signal.aborted) {
          setJournalEntryLoading(false);
        }
      }
    };

    getJournalEntryData();

    return () => {
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [id]);

  // Update journal entry function
  const updateJournalEntry = async (journalEntry: JournalEntry) => {
    // Cancel any in-progress update
    if (updateAbortControllerRef.current) {
      updateAbortControllerRef.current.abort();
    }

    // Create a new AbortController for this update
    updateAbortControllerRef.current = new AbortController();
    const signal = updateAbortControllerRef.current.signal;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/journal-entry/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(journalEntry),
        signal: signal,
      });

      if (signal.aborted) return;

      if (!response.ok) {
        throw new Error("Failed to update journal entry");
      }
      const updatedData = await response.json();
      setJournalEntryData(updatedData);

      // NOTE: do not yet need to return anything from this update function
      // return updatedData;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Update aborted");
        return; // Don't update state if aborted
      }

      console.error("Error updating journal entry:", error);
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

  //   // Function to abort an in-progress update
  //   // Keep in case I need to abort the update function for future scenarios
  //   const abortUpdate = () => {
  //     if (updateAbortControllerRef.current && submitting) {
  //       updateAbortControllerRef.current.abort();
  //       updateAbortControllerRef.current = null;
  //     }
  //   };

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

  return {
    journalEntryData,
    journalEntryError,
    journalEntryLoading,
    updateJournalEntry,
    submitting,
  };
}
