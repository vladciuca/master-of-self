//CUSTOM STEPS & steps config
import {
  //   customSteps,
  customStepConfigs,
  generateCustomStepsFromConfig,
} from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

import { useUserDisciplines } from "@hooks/disciplines/useUserDisciplines";
import { useActiveDisciplinesConfigs } from "@hooks/user/useActiveDisciplinesConfigs";
import { useUserProfile } from "@context/UserProfileContext";

export function useDisciplineList() {
  const { disciplines, disciplinesError, disciplinesLoading } =
    useUserDisciplines();
  const {
    activeDisciplinesConfigs,
    activeDisciplinesConfigsLoading,
    activeDisciplinesConfigsError,
  } = useActiveDisciplinesConfigs();

  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();

  //ACTIVE DISCIPLINES IDS!
  const activeDisciplineIdList =
    !userProfileLoading && !userProfileError
      ? userProfile.activeDisciplines ?? []
      : [];

  // ALL ACTIVE DISCIPLINE CONFIGS!
  const activeDisciplineSteps =
    !activeDisciplinesConfigsLoading && !activeDisciplinesConfigsError
      ? activeDisciplinesConfigs ?? []
      : [];

  //STEPS IS +COMPONENT

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

  // ACTIVE DISCIPLINE CONFIGS + AVAILABLE CUSTOM DISCIPLINE CONFIGS
  const activeDisciplinesList = [
    ...activeDisciplinesConfigs,
    ...activeCustomDisciplines,
  ];

  const activeDisciplinesStepList = generateCustomStepsFromConfig(
    activeDisciplinesList
  );

  const listLoading = disciplinesLoading;
  const listError = disciplinesError;

  return {
    //RETURNS LIST OF IDS? or CONFIGS?
    disciplineList,
    //RETURNS DISCIPLINE STEP (USER STEPS + APP STEPS(USER SELECTED) + OTHER USERS STEPS)
    disciplineStepList,
    activeDisciplinesStepList,
    listLoading,
    listError,
  };
}
