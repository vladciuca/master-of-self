//CUSTOM STEPS & steps config
import {
  //   customSteps,
  customStepConfigs,
  generateCustomStepsFromConfig,
} from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
//USER STEPS (hook)
import { useUserDisciplines } from "@hooks/disciplines/useUserDisciplines";
import { useActiveDisciplines } from "@hooks/user/useActiveDisciplines";

import { useUserProfile } from "@context/UserProfileContext";

export function useDisciplineList() {
  const { disciplines, disciplinesError, disciplinesLoading } =
    useUserDisciplines();

  const { activeDisciplines, isLoading, error } = useActiveDisciplines();

  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();
  const activeDisciplineIdList = userProfile.activeDisciplines;

  const usersDisciplinesSteps =
    !disciplinesLoading && !disciplinesError ? disciplines : [];
  //   const usersDisciplinesSteps = disciplines;
  const customAppSteps = customStepConfigs;

  const disciplineList = [...usersDisciplinesSteps, ...customAppSteps];

  //THIS IS FOR FORM STEP CONTROLLER - adds dynamic component to array
  const disciplineStepList = generateCustomStepsFromConfig(disciplineList);

  const activeCustomDisciplines = customAppSteps.filter(
    (discipline) =>
      discipline._id && activeDisciplineIdList.includes(String(discipline._id))
  );

  const activeDisciplinesList = [
    ...activeDisciplines,
    ...activeCustomDisciplines,
  ];
  const activeDisciplinesStepList = generateCustomStepsFromConfig(
    activeDisciplinesList
  );

  const listLoading = disciplinesLoading;
  const listError = disciplinesError;

  return {
    disciplineList,
    disciplineStepList,
    activeDisciplinesStepList,
    listLoading,
    listError,
  };
}
