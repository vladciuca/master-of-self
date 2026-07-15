import { useState, useEffect } from "react";
import {
  //   customSteps,
  //NOTE: I CAN MOVE THIS IN A SEPARATE FILE and import it here
  customStepConfigs,
  generateCustomStepsFromConfig,
} from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { useUserProfile } from "@context/UserProfileContext";
import type { Practice } from "@models/mongodb";

export function usePracticeList() {
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  //NOTE: practicesConfigs - regardless of user JUST from DB
  const [practicesConfigs, setPractices] = useState<Practice[]>([]);
  const [practicesConfigsLoading, setPracticesConfigsLoading] =
    useState(false);
  const [practicesConfigsError, setPracticesConfigsError] = useState<
    string | null
  >(null);

  //====================================================================
  //PROFILE PRACTICES KEY
  const learnedPracticeIDs =
    !userProfileLoading && !userProfileError
      ? Object.keys(userProfile.practices || {})
      : [];

  // Fetch active practice details whenever the IDs list changes
  useEffect(() => {
    // Only proceed if we have IDs and the profile is loaded
    if (userProfileLoading || learnedPracticeIDs.length === 0) {
      // Just set the loading state based on userProfileLoading
      setPracticesConfigsLoading(userProfileLoading);

      // Clear practices if there are no IDs AND profile is loaded
      if (!userProfileLoading && learnedPracticeIDs.length === 0) {
        setPractices([]);
      }
      return;
    }

    const fetchActivePractices = async () => {
      setPracticesConfigsLoading(true);
      setPracticesConfigsError(null);

      try {
        const response = await fetch("/api/practice/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ practiceIds: learnedPracticeIDs }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch active practices"
          );
        }

        const data = await response.json();
        setPractices(data.practices || []);
      } catch (error) {
        console.error("Error loading active practice details:", error);
        setPracticesConfigsError(
          (error as Error).message || "Failed to load active practices"
        );
      } finally {
        setPracticesConfigsLoading(false);
      }
    };

    fetchActivePractices();
  }, [
    //NOTE: learnedPracticeIDs is an []
    // adding .join(",") fixes the array reference problem
    //Object.keys() always returns a new array object with a new reference in memory, even if the keys are identical
    learnedPracticeIDs.join(","),
    userProfileLoading,
  ]);

  //====================================================================
  //NOW I NEED TO FILTER these in CUSTOM STEPS
  const learnedCustomPracticesConfigs = customStepConfigs.filter(
    (practice) =>
      practice._id && learnedPracticeIDs.includes(String(practice._id))
  );

  //====================================================================
  //NOW WE ADD THE - CONFIG - results from DB + CUSTOM STEPS(in proj)

  const learnedPracticeList = [
    ...practicesConfigs,
    ...learnedCustomPracticesConfigs,
  ];

  //====================================================================
  //NOW LETS GET THE ACTIVE PRACTICE CONFIGS
  const activePracticeIds =
    !userProfileLoading && !userProfileError
      ? userProfile.activePractices ?? []
      : [];

  // Filter the learnedPracticeList to get only those practices that are active
  const activePracticeConfigs = learnedPracticeList.filter(
    (practice) =>
      practice._id && activePracticeIds.includes(String(practice._id))
  );

  const activePracticeSteps = generateCustomStepsFromConfig(
    activePracticeConfigs
  );

  return {
    learnedPracticeList,
    activePracticeSteps,
    practicesConfigsLoading: practicesConfigsLoading || userProfileLoading,
    practicesConfigsError,
  };
}
