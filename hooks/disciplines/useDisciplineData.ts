import { useState, useEffect, useCallback, useRef } from "react";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

// Define the type for discipline data from API
export type DisciplineData = {
  name: string;
  icon: string;
  title?: string;
  color?: string;
  // Add any other properties you need
};

export function useDisciplinesData(
  dayEntry?: JournalDayEntry,
  nightEntry?: JournalNightEntry,
  disciplineIds?: string[]
) {
  const [disciplineData, setDisciplineData] = useState<{
    [key: string]: DisciplineData;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to compare disciplineIds across renders
  const prevDisciplineIdsRef = useRef<string[] | undefined>();

  // Function to check if arrays of ids are different
  const idsAreDifferent = (prevIds?: string[], newIds?: string[]): boolean => {
    if (!prevIds && !newIds) return false;
    if (!prevIds || !newIds) return true;
    if (prevIds.length !== newIds.length) return true;
    return prevIds.some((id, index) => id !== newIds[index]);
  };

  // Extract all unique discipline IDs from both day and night entries
  const getDisciplineIds = useCallback(() => {
    const ids = new Set<string>();

    if (disciplineIds?.length) {
      disciplineIds.forEach((id: string) => ids.add(id));
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
  }, [dayEntry, nightEntry, disciplineIds]);

  const fetchDisciplineData = useCallback(async () => {
    const disciplineIds = getDisciplineIds();

    try {
      // Only fetch from API if there are discipline IDs to fetch
      let apiData: { [key: string]: DisciplineData } = {};

      if (disciplineIds.length > 0) {
        const response = await fetch(
          `/api/discipline/discipline-data?ids=${disciplineIds.join(",")}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch discipline data");
        }

        apiData = await response.json();
      }

      // Convert customStepConfigs to the appropriate format
      const customData: { [key: string]: DisciplineData } = {};
      customStepConfigs.forEach((config) => {
        // Use the discipline as the key
        customData[config.discipline] = {
          name: config.discipline,
          icon: config.icon,
          title: config.title,
        };
      });

      // Combine API data and custom data
      setDisciplineData({ ...apiData, ...customData });
    } catch (error) {
      console.error("Failed to fetch discipline data:", error);
      setError("Failed to fetch discipline data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [getDisciplineIds]);

  useEffect(() => {
    const currentIds = getDisciplineIds();

    // Only refetch if the IDs have actually changed
    if (idsAreDifferent(prevDisciplineIdsRef.current, currentIds)) {
      setIsLoading(true);
      fetchDisciplineData();
      // Update ref with current ids
      prevDisciplineIdsRef.current = currentIds;
    }

    // Initial load when there are no IDs yet
    if (!prevDisciplineIdsRef.current) {
      setIsLoading(true);
      fetchDisciplineData();
      prevDisciplineIdsRef.current = currentIds;
    }
  }, [
    dayEntry,
    nightEntry,
    disciplineIds,
    getDisciplineIds,
    fetchDisciplineData,
  ]);

  return { disciplineData, isLoading, error };
}
