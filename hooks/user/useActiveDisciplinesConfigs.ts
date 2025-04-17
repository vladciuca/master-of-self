import { useState, useEffect } from "react";
import { useUserProfile } from "@context/UserProfileContext";
import type { Discipline } from "@models/mongodb";

//USE ACTIVE DISCIPLINE CONFIGS
export function useActiveDisciplinesConfigs() {
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  const [activeDisciplinesConfigs, setActiveDisciplines] = useState<
    Discipline[]
  >([]);
  const [
    activeDisciplinesConfigsLoading,
    setIsActiveDisciplinesConfigsLoading,
  ] = useState(false);
  const [activeDisciplinesConfigsError, setActiveDisciplinesConfigsError] =
    useState<string | null>(null);

  const activeDisciplineIds =
    !userProfileLoading && !userProfileError
      ? userProfile.activeDisciplines ?? []
      : [];

  // Fetch active disciplines details whenever the IDs list changes
  useEffect(() => {
    if (userProfileLoading || activeDisciplineIds.length === 0) {
      // Clear disciplines if there are no active IDs
      if (activeDisciplineIds.length === 0) {
        setActiveDisciplines([]);
      }
      return;
    }

    const fetchActiveDisciplines = async () => {
      setIsActiveDisciplinesConfigsLoading(true);
      setActiveDisciplinesConfigsError(null);

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
        setActiveDisciplinesConfigsError(
          (error as Error).message || "Failed to load active disciplines"
        );
      } finally {
        setIsActiveDisciplinesConfigsLoading(false);
      }
    };

    fetchActiveDisciplines();
  }, [activeDisciplineIds, userProfileLoading]);

  // Function to get a specific discipline by ID
  const getDisciplineById = (id: string) => {
    return activeDisciplinesConfigs.find(
      (discipline) => discipline._id && discipline._id.toString() === id
    );
  };

  return {
    activeDisciplinesConfigs,
    activeDisciplinesConfigsLoading:
      activeDisciplinesConfigsLoading || userProfileLoading,
    activeDisciplinesConfigsError,
    getDisciplineById,
  };
}
