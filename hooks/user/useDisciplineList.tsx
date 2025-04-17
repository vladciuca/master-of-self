//CUSTOM STEPS & steps config
import {
  //   customSteps,
  customStepConfigs,
  generateCustomStepsFromConfig,
} from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
//USER STEPS (hook)
import { useUserDisciplines } from "@hooks/disciplines/useUserDisciplines";

export function useDisciplineList() {
  const { disciplines, disciplinesError, disciplinesLoading } =
    useUserDisciplines();

  const usersDisciplinesSteps =
    !disciplinesLoading && !disciplinesError ? disciplines : [];
  //   const usersDisciplinesSteps = disciplines;
  const customAppSteps = customStepConfigs;

  const disciplineList = [...usersDisciplinesSteps, ...customAppSteps];

  //THIS IS FOR FORM STEP CONTROLLER - adds dynamic component to array
  const disciplineStepList = generateCustomStepsFromConfig(disciplineList);

  const listLoading = disciplinesLoading;
  const listError = disciplinesError;

  return { disciplineList, disciplineStepList, listLoading, listError };
}
