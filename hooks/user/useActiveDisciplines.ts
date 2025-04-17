// hooks/disciplines/useActiveDisciplineDetails.ts
import { useState, useEffect } from "react";
import { useUpdateActiveDisciplines } from "@hooks/user/useUpdateActiveDisciplines";
import type { Discipline } from "@models/mongodb";

export function useActiveDisciplines() {
  const { activeDisciplines: activeDisciplineIds, isLoading: idsLoading } =
    useUpdateActiveDisciplines();

  const [activeDisciplines, setActiveDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active disciplines details whenever the IDs list changes
  useEffect(() => {
    if (idsLoading || activeDisciplineIds.length === 0) {
      // Clear disciplines if there are no active IDs
      if (activeDisciplineIds.length === 0) {
        setActiveDisciplines([]);
      }
      return;
    }

    const fetchActiveDisciplines = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/discipline/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disciplineIds: activeDisciplineIds }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch active disciplines"
          );
        }

        const data = await response.json();
        setActiveDisciplines(data.disciplines || []);
      } catch (error) {
        console.error("Error loading active discipline details:", error);
        setError(
          (error as Error).message || "Failed to load active disciplines"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveDisciplines();
  }, [activeDisciplineIds, idsLoading]);

  // Function to get a specific discipline by ID
  const getDisciplineById = (id: string) => {
    return activeDisciplines.find(
      (discipline) => discipline._id && discipline._id.toString() === id
    );
  };

  return {
    activeDisciplines,
    isLoading: isLoading || idsLoading,
    error,
    getDisciplineById,
  };
}
