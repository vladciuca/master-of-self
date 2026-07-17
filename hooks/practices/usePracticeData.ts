import { useState, useEffect, useCallback, useRef } from "react";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

// Define the type for discipline data from API
export type PracticeData = {
  name: string;
  icon: string;
  title?: string;
  color?: string;
  // Add any other properties you need
};

export function usePracticeData(
  dayEntry?: JournalDayEntry,
  nightEntry?: JournalNightEntry,
  practiceIds?: string[]
) {
  const [practiceData, setPracticeData] = useState<{
    [key: string]: PracticeData;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to compare practiceIds across renders
  const prevPracticeIdsRef = useRef<string[] | undefined>();

  // Function to check if arrays of ids are different
  const idsAreDifferent = (prevIds?: string[], newIds?: string[]): boolean => {
    if (!prevIds && !newIds) return false;
    if (!prevIds || !newIds) return true;
    if (prevIds.length !== newIds.length) return true;
    return prevIds.some((id, index) => id !== newIds[index]);
  };

  // Extract all unique discipline IDs from both day and night entries
  const getPracticeIds = useCallback(() => {
    const ids = new Set<string>();

    if (practiceIds?.length) {
      practiceIds.forEach((id: string) => ids.add(id));
    }

    // Process day entries
    if (dayEntry) {
      Object.keys(dayEntry).forEach((step) => {
        // Check if the step looks like an ID (e.g., MongoDB ObjectId)
        if (step !== "day" && /^[a-f\d]{24}$/i.test(step)) {
          ids.add(step);
        }
      });
    }

    // Process night entries
    if (nightEntry) {
      Object.keys(nightEntry).forEach((step) => {
        // Check if the step looks like an ID (e.g., MongoDB ObjectId)
        if (step !== "night" && /^[a-f\d]{24}$/i.test(step)) {
          ids.add(step);
        }
      });
    }

    return Array.from(ids);
  }, [dayEntry, nightEntry, practiceIds]);

  const fetchPracticeData = useCallback(async () => {
    const practiceIds = getPracticeIds();

    try {
      // Only fetch from API if there are discipline IDs to fetch
      let apiData: { [key: string]: PracticeData } = {};

      if (practiceIds.length > 0) {
        const response = await fetch(
          `/api/practice/practice-data?ids=${practiceIds.join(",")}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch discipline data");
        }

        apiData = await response.json();
      }

      // Convert customStepConfigs to the appropriate format
      const customData: { [key: string]: PracticeData } = {};
      customStepConfigs.forEach((config) => {
        // Use the discipline as the key
        customData[config.discipline] = {
          name: config.discipline,
          icon: config.icon,
          title: config.title,
        };
      });

      // Combine API data and custom data
      setPracticeData({ ...apiData, ...customData });
    } catch (error) {
      console.error("Failed to fetch discipline data:", error);
      setError("Failed to fetch discipline data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [getPracticeIds]);

  useEffect(() => {
    const currentIds = getPracticeIds();

    // Only refetch if the IDs have actually changed
    if (idsAreDifferent(prevPracticeIdsRef.current, currentIds)) {
      setIsLoading(true);
      fetchPracticeData();
      // Update ref with current ids
      prevPracticeIdsRef.current = currentIds;
    }

    // Initial load when there are no IDs yet
    if (!prevPracticeIdsRef.current) {
      setIsLoading(true);
      fetchPracticeData();
      prevPracticeIdsRef.current = currentIds;
    }
  }, [
    dayEntry,
    nightEntry,
    practiceIds,
    getPracticeIds,
    fetchPracticeData,
  ]);

  return { practiceData, isLoading, error };
}
