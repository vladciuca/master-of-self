import { useState, useEffect } from "react";
import {
  //   customSteps,
  //NOTE: I CAN MOVE THIS IN A SEPARATE FILE and import it here
  customStepConfigs,
  generateCustomStepsFromConfig,
} from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { useUserProfile } from "@context/UserProfileContext";
import type { Discipline } from "@models/mongodb";

export function useDisciplineList() {
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  //NOTE: disciplinesConfigs - regardless of user JUST from DB
  const [disciplinesConfigs, setDisciplines] = useState<Discipline[]>([]);
  const [disciplinesConfigsLoading, setDisciplinesConfigsLoading] =
    useState(false);
  const [disciplinesConfigsError, setDisciplinesConfigsError] = useState<
    string | null
  >(null);

  //====================================================================
  //PROFILE DISCIPLINES KEY
  const learnedDisciplinesIDs =
    !userProfileLoading && !userProfileError
      ? Object.keys(userProfile.disciplines || {})
      : [];

  // Fetch active disciplines details whenever the IDs list changes
  useEffect(() => {
    // Only proceed if we have IDs and the profile is loaded
    if (userProfileLoading || learnedDisciplinesIDs.length === 0) {
      // Just set the loading state based on userProfileLoading
      setDisciplinesConfigsLoading(userProfileLoading);

      // Clear disciplines if there are no IDs AND profile is loaded
      if (!userProfileLoading && learnedDisciplinesIDs.length === 0) {
        setDisciplines([]);
      }
      return;
    }

    const fetchActiveDisciplines = async () => {
      setDisciplinesConfigsLoading(true);
      setDisciplinesConfigsError(null);

      try {
        const response = await fetch("/api/discipline/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disciplineIds: learnedDisciplinesIDs }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch active disciplines"
          );
        }

        const data = await response.json();
        setDisciplines(data.disciplines || []);
      } catch (error) {
        console.error("Error loading active discipline details:", error);
        setDisciplinesConfigsError(
          (error as Error).message || "Failed to load active disciplines"
        );
      } finally {
        setDisciplinesConfigsLoading(false);
      }
    };

    fetchActiveDisciplines();
  }, [
    //NOTE: learnedDisciplinesIDs is an []
    // adding .join(",") fixes the array reference problem
    //Object.keys() always returns a new array object with a new reference in memory, even if the keys are identical
    learnedDisciplinesIDs.join(","),
    userProfileLoading,
  ]);

  //====================================================================
  //NOW I NEED TO FILTER these in CUSTOM STEPS
  const learnedCustomDisciplinesConfigs = customStepConfigs.filter(
    (discipline) =>
      discipline._id && learnedDisciplinesIDs.includes(String(discipline._id))
  );

  //====================================================================
  //NOW WE ADD THE - CONFIG - results from DB + CUSTOM STEPS(in proj)

  const learnedDisciplineList = [
    ...disciplinesConfigs,
    ...learnedCustomDisciplinesConfigs,
  ];

  //====================================================================
  //NOW LETS GET THE ACTIVE DISCIPLINE CONFIGS
  const activeDisciplineIds =
    !userProfileLoading && !userProfileError
      ? userProfile.activeDisciplines ?? []
      : [];

  // Filter the learnedDisciplineList to get only those disciplines that are active
  const activeDisciplineConfigs = learnedDisciplineList.filter(
    (discipline) =>
      discipline._id && activeDisciplineIds.includes(String(discipline._id))
  );

  const activeDisciplineSteps = generateCustomStepsFromConfig(
    activeDisciplineConfigs
  );

  return {
    learnedDisciplineList,
    activeDisciplineSteps,
    disciplinesConfigsLoading: disciplinesConfigsLoading || userProfileLoading,
    disciplinesConfigsError,
  };
}
