// // hooks/useDisciplinesData.ts
// import { useState, useEffect, useCallback } from "react";
// import type { JournalDayEntry, JournalNightEntry } from "@models/types";

// import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

// // Define the type for discipline data from API
// export type DisciplineData = {
//   name: string;
//   icon: string;
//   title?: string;
//   color?: string;
//   // Add any other properties you need
// };

// export function useDisciplinesData(
//   dayEntry?: JournalDayEntry,
//   nightEntry?: JournalNightEntry
// ) {
//   const [disciplineData, setDisciplineData] = useState<{
//     [key: string]: DisciplineData;
//   }>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Extract all unique discipline IDs from both day and night entries
//   const getDisciplineIds = useCallback(() => {
//     const ids = new Set<string>();

//     // Process day entries
//     if (dayEntry) {
//       Object.keys(dayEntry).forEach((step) => {
//         // Check if the step looks like an ID (e.g., MongoDB ObjectId)
//         if (step !== "day" && /^[a-f\d]{24}$/i.test(step)) {
//           ids.add(step);
//         }
//       });
//     }

//     // Process night entries
//     if (nightEntry) {
//       Object.keys(nightEntry).forEach((step) => {
//         // Check if the step looks like an ID (e.g., MongoDB ObjectId)
//         if (step !== "night" && /^[a-f\d]{24}$/i.test(step)) {
//           ids.add(step);
//         }
//       });
//     }

//     return Array.from(ids);
//   }, [dayEntry, nightEntry]);

//   const fetchDisciplineData = useCallback(async () => {
//     const disciplineIds = getDisciplineIds();
//     if (disciplineIds.length === 0) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `/api/discipline/discipline-data?ids=${disciplineIds.join(",")}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch discipline data");
//       }

//       const data: { [key: string]: DisciplineData } = await response.json();
//       setDisciplineData(data);
//     } catch (error) {
//       console.error("Failed to fetch discipline data:", error);
//       setError("Failed to fetch discipline data. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [getDisciplineIds]);

//   useEffect(() => {
//     fetchDisciplineData();
//   }, [fetchDisciplineData]);

//   return { disciplineData, isLoading, error };
// }
import { useState, useEffect, useCallback } from "react";
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
  nightEntry?: JournalNightEntry
) {
  const [disciplineData, setDisciplineData] = useState<{
    [key: string]: DisciplineData;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract all unique discipline IDs from both day and night entries
  const getDisciplineIds = useCallback(() => {
    const ids = new Set<string>();

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
  }, [dayEntry, nightEntry]);

  const fetchDisciplineData = useCallback(async () => {
    const disciplineIds = getDisciplineIds();

    setIsLoading(true);
    setError(null);

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
          // Add any other properties you need
        };
      });

      // Combine API data and custom data
      // Custom data will override API data if there are duplicates
      setDisciplineData({ ...apiData, ...customData });
    } catch (error) {
      console.error("Failed to fetch discipline data:", error);
      setError("Failed to fetch discipline data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [getDisciplineIds]);

  useEffect(() => {
    fetchDisciplineData();
  }, [fetchDisciplineData]);

  return { disciplineData, isLoading, error };
}
