"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

// import { Bonus } from "@components/journal/journal-entry-form/form-steps/steps/bonus/Bonus";
// import { Day } from "@components/journal/journal-entry-form/form-steps/steps/Day";
// import { Night } from "@components/journal/journal-entry-form/form-steps/steps/Night";
// import { Gratitude } from "@components/journal/journal-entry-form/form-steps/steps/Gratitude";
// import { Affirmations } from "./form-steps/steps/Affirmations";
// import { Highlights } from "@components/journal/journal-entry-form/form-steps/steps/Highlights";
// import { Reflection } from "@components/journal/journal-entry-form/form-steps/steps/Reflection";
// import { Willpower } from "@components/journal/journal-entry-form/form-steps/steps/willpower/Willpower";
// import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/steps/HabitActionsStep";
import { FormStepProgress } from "./FormStepProgress";
import { FormStepNavigation } from "./FormStepNavigation";
import { JournalEntry } from "@models/types";
// import { isEvening } from "@lib/time";
import { getDayDisciplineScores } from "@lib/score";
import { calculateHabitsXpFromEntry } from "@lib/level";

import { createBuiltInSteps } from "./form-steps/steps/StepConfig";

// TEST_FLAG: used for enabling all forms steps
const SHOW_ALL_TEST = true;

// Define the known day and night fields for easier management
const DAY_FIELDS = ["day", "gratitude", "affirmations"];
const NIGHT_FIELDS = ["night", "highlights", "reflection"];

// Type for the form step configuration
// type FormStep = {
//   // icon?: React.ReactNode;
//   type: string;
//   component: JSX.Element;
//   isAvailable: boolean;
//   category?: "day" | "night" | "other";
// };

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  userEveningTime?: string;
  //NOTE should have to find a better way to set availability
  availableSteps?: Record<string, boolean>;
  willpowerMultiplier: number;
  customSteps?: Array<{
    icon: React.ReactNode;
    type: string;
    component: JSX.Element;
    category: "day" | "night" | "other";
    isAvailable?: boolean;
  }>;
};

export type JournalFormContext = UseFormReturn<JournalEntry>;

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  availableSteps = {
    gratitude: false,
    affirmations: false,
    reflection: false,
    habits: false,
  },
  willpowerMultiplier,
  customSteps = [],
}: FormStepControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Create default values dynamically
  const createDefaultValues = (): JournalEntry => {
    const defaultValues: JournalEntry = {
      dailyWillpower: journalEntryData?.dailyWillpower ?? 0,
      bonusWillpower: journalEntryData?.bonusWillpower ?? 0,
      dayEntry: { day: [] },
      nightEntry: { night: [] },
      habits: journalEntryData?.habits ?? {},
    };

    // Add default values for built-in day fields
    if (journalEntryData?.dayEntry) {
      defaultValues.dayEntry = {
        ...defaultValues.dayEntry,
        ...journalEntryData.dayEntry,
      };
    } else {
      // Initialize with empty arrays for standard fields
      DAY_FIELDS.forEach((field) => {
        if (defaultValues.dayEntry) {
          defaultValues.dayEntry[field] = [];
        }
      });
    }

    // Add default values for built-in night fields
    if (journalEntryData?.nightEntry) {
      defaultValues.nightEntry = {
        ...defaultValues.nightEntry,
        ...journalEntryData.nightEntry,
      };
    } else {
      // Initialize with empty arrays for standard fields
      NIGHT_FIELDS.forEach((field) => {
        if (defaultValues.nightEntry) {
          defaultValues.nightEntry[field] = [];
        }
      });
    }

    // Add any custom fields from customSteps
    customSteps.forEach((step) => {
      if (step.category === "day" && defaultValues.dayEntry) {
        defaultValues.dayEntry[step.type] =
          journalEntryData?.dayEntry?.[step.type] || [];
      } else if (step.category === "night" && defaultValues.nightEntry) {
        defaultValues.nightEntry[step.type] =
          journalEntryData?.nightEntry?.[step.type] || [];
      }
    });

    return defaultValues;
  };

  const methods = useForm<JournalEntry>({
    defaultValues: createDefaultValues(),
  });

  // Get form values and methods
  const { watch, setValue, getValues } = methods;

  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  // const day = watch("dayEntry.day") || [];

  // Calculate DAY disciplines scores & set them to totalWP * WPx
  const dayEntryDisciplineScores = useMemo(() => {
    const currentEntry = getValues();
    const disciplines = getDayDisciplineScores(currentEntry);

    // Calculate total willpower by summing all discipline scores
    const dailyWillpower = Object.values(disciplines).reduce(
      (sum, score) => sum + (score || 0),
      0
    );

    // Update the form value whenever disciplines change
    setValue(
      "dailyWillpower",
      Math.floor(dailyWillpower * willpowerMultiplier)
    );

    return disciplines;
  }, [
    // Watch all day entry fields dynamically
    ...DAY_FIELDS.map((field) => watch(`dayEntry.${field}`)),
    ...customSteps
      .filter((step) => step.category === "day")
      .map((step) => watch(`dayEntry.${step.type}`)),
    setValue,
    getValues,
    willpowerMultiplier,
  ]);

  useEffect(() => {
    if (journalEntryData) {
      // Update basic fields
      setValue("dailyWillpower", journalEntryData.dailyWillpower ?? 0);
      setValue("bonusWillpower", journalEntryData.bonusWillpower ?? 0);

      // Update day entry fields dynamically
      if (journalEntryData.dayEntry) {
        // Update core fields first
        DAY_FIELDS.forEach((field) => {
          if (journalEntryData.dayEntry?.[field] !== undefined) {
            setValue(
              `dayEntry.${field}`,
              journalEntryData.dayEntry[field] ?? []
            );
          }
        });

        // Update any custom day fields
        customSteps
          .filter((step) => step.category === "day")
          .forEach((step) => {
            if (journalEntryData.dayEntry?.[step.type] !== undefined) {
              setValue(
                `dayEntry.${step.type}`,
                journalEntryData.dayEntry[step.type] ?? []
              );
            }
          });
      }

      // Update night entry fields dynamically
      if (journalEntryData.nightEntry) {
        // Update core fields first
        NIGHT_FIELDS.forEach((field) => {
          if (journalEntryData.nightEntry?.[field] !== undefined) {
            setValue(
              `nightEntry.${field}`,
              journalEntryData.nightEntry[field] ?? []
            );
          }
        });

        //NOTE USING CUSTOM STEPS without the sending the prop causes infinite loop
        // Update any custom night fields
        customSteps
          .filter((step) => step.category === "night")
          .forEach((step) => {
            if (journalEntryData.nightEntry?.[step.type] !== undefined) {
              setValue(
                `nightEntry.${step.type}`,
                journalEntryData.nightEntry[step.type] ?? []
              );
            }
          });
      }

      // Update habits
      if (journalEntryData.habits) {
        setValue("habits", journalEntryData.habits);
      }
    }
  }, [journalEntryData, setValue, customSteps]);

  // Build form steps dynamically
  // const formSteps = useMemo(() => {
  //   const steps: FormStep[] = [
  //     {
  //       type: "bonus",
  //       component: <Bonus />,
  //       isAvailable:
  //         SHOW_ALL_TEST ||
  //         (!isEvening(userEveningTime) && watch("bonusWillpower") > 0),
  //       category: "other",
  //     },
  //     {
  //       type: "gratitude",
  //       component: <Gratitude />,
  //       isAvailable:
  //         SHOW_ALL_TEST ||
  //         (!isEvening(userEveningTime) && availableSteps.gratitude),
  //       category: "day",
  //     },
  //     {
  //       type: "day",
  //       component: <Day />,
  //       isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
  //       category: "day",
  //     },
  //     {
  //       type: "affirmations",
  //       component: <Affirmations />,
  //       isAvailable:
  //         SHOW_ALL_TEST ||
  //         (!isEvening(userEveningTime) && availableSteps.affirmations),
  //       category: "day",
  //     },
  //     {
  //       type: "night",
  //       component: <Night />,
  //       isAvailable:
  //         SHOW_ALL_TEST || (isEvening(userEveningTime) && day?.length > 0),
  //       category: "night",
  //     },
  //     {
  //       type: "highlights",
  //       component: <Highlights />,
  //       isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
  //       category: "night",
  //     },
  //     {
  //       type: "reflection",
  //       component: <Reflection />,
  //       isAvailable:
  //         SHOW_ALL_TEST ||
  //         (isEvening(userEveningTime) && availableSteps.reflection),
  //       category: "night",
  //     },
  //     {
  //       type: "willpower",
  //       component: <Willpower />,
  //       isAvailable: true,
  //       category: "other",
  //     },
  //     {
  //       type: "habits",
  //       component: <HabitActionsStep />,
  //       isAvailable: availableSteps.habits ?? false,
  //       category: "other",
  //     },
  //   ];

  //   // Add custom steps
  //   customSteps.forEach((customStep) => {
  //     steps.push({
  //       type: customStep.type,
  //       component: customStep.component,
  //       isAvailable: customStep.isAvailable ?? true,
  //       category: customStep.category,
  //     });
  //   });

  //   return steps;
  // }, [watch, userEveningTime, availableSteps, customSteps]);

  // Inside FormStepController component
  const formSteps = useMemo(() => {
    // Get built-in steps
    const steps = createBuiltInSteps(
      watch,
      userEveningTime,
      availableSteps,
      SHOW_ALL_TEST
    );

    // Add custom steps
    customSteps.forEach((customStep) => {
      steps.push({
        icon: customStep.icon,
        type: customStep.type,
        component: customStep.component,
        isAvailable: customStep.isAvailable ?? true,
        category: customStep.category,
      });
    });

    return steps;
  }, [watch, userEveningTime, availableSteps, customSteps]);

  const filteredSteps = useMemo(
    () => formSteps.filter((step) => step.isAvailable),
    [formSteps]
  );

  const stepTypes = useMemo(
    () => filteredSteps.map((step) => step.type),
    [availableSteps]
  );

  // Get the current step type from URL or use the first available step
  const currentStepType = searchParams.get("step");
  const currentStepIndex = stepTypes.indexOf(currentStepType || "");

  // This function updates the URL with the new step
  const setStep = useCallback(
    (stepType: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("step", stepType);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Initialize the form with the correct step
  useEffect(() => {
    if (!isInitialized && filteredSteps.length > 0) {
      const initialStepType =
        currentStepType && stepTypes.includes(currentStepType)
          ? currentStepType
          : stepTypes[0];
      setStep(initialStepType);
      setIsInitialized(true);
    }
  }, [isInitialized, availableSteps, currentStepType, stepTypes, setStep]);

  const handleStepChange = useCallback(
    (stepType: string, shouldSubmit = true) => {
      // Default to true
      if (!submitting) {
        if (shouldSubmit) {
          // Get current form data
          const formData = getValues();
          // Submit the form data
          onSubmit(formData).then(() => {
            // Then change the step
            setStep(stepType);
          });
        } else {
          // Just change the step without submitting
          setStep(stepType);
        }
      }
    },
    [setStep, submitting, getValues, onSubmit]
  );

  const handleNextForm = useCallback(async () => {
    const formData = getValues();
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < filteredSteps.length) {
      await onSubmit(formData); // submits data after each step
      handleStepChange(stepTypes[nextIndex], false); // Don't submit again
    } else {
      await onSubmit(formData);
      router.push("/journal");
    }
  }, [
    currentStepIndex,
    filteredSteps.length,
    getValues,
    onSubmit,
    handleStepChange,
    router,
    stepTypes,
  ]);

  const handlePrevForm = useCallback(async () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      // Get current form data
      const formData = getValues();
      // Submit the form data before going back
      await onSubmit(formData);
      handleStepChange(stepTypes[prevIndex], false); // Don't submit again
    }
  }, [currentStepIndex, handleStepChange, stepTypes, getValues, onSubmit]);

  const progressPercentage =
    ((currentStepIndex + 1) / filteredSteps.length) * 100;

  const currentStep = stepTypes[currentStepIndex !== -1 ? currentStepIndex : 0];

  const currentStepComponent =
    filteredSteps[currentStepIndex !== -1 ? currentStepIndex : 0]?.component;

  // TEMP UTIL FUNCTION
  // NOTE: move to util when cleaning up this file
  function countMatchingElements(
    arr1: string[] | undefined,
    arr2: string[] | undefined
  ) {
    const safeArr1 = arr1 || [];
    const safeArr2 = arr2 || [];
    const set1 = new Set(safeArr1);
    return safeArr2.filter((element) => set1.has(element)).length;
  }

  const formValues = getValues();
  const habitXpValues = calculateHabitsXpFromEntry({
    entryHabits: formValues.habits || {},
    entryWillpower: formValues.dailyWillpower + formValues.dailyWillpower,
  });

  // NOTE: move to util when cleaning up this file
  const countNonZeroValues = (obj: Record<string, number>) =>
    Object.values(obj).filter((value) => value !== 0).length;

  // Dynamically get counts for any field
  // For the second error, update the getFieldCount function to handle the "other" category:
  const getFieldCount = (
    category: "day" | "night" | "other",
    field: string
  ): number => {
    if (category === "day") {
      return watch(`dayEntry.${field}`)?.length || 0;
    } else if (category === "night") {
      return watch(`nightEntry.${field}`)?.length || 0;
    } else {
      // For "other" category, we don't have a specific entry type
      // Return 0 or handle it differently based on your requirements
      return 0;
    }
  };

  // First, update the progressProps type to allow for dynamic string keys
  // Add this type definition before creating the progressProps object:
  // type ProgressProps = {
  //   dayCount: number;
  //   dailyGoalsCompleted: number;
  //   habitActionsCount: number;
  //   [key: `${string}Count`]: number;
  // };

  //NOTE??????? This cound function can it no be moved inside the FormStepProgress.tsx
  // why is it dose form here, we have the steps inside FormStepProgress
  // Build progress props dynamically with all the counts
  const progressProps: {
    dailyGoals: number;
    dailyGoalsCompleted: number;
    habitActionsCount: number;
    [key: `${string}Count`]: number;
  } = {
    // Add the dailyGoals for the day step
    dailyGoals: watch("dayEntry.day")?.length || 0,
    // Add the dailyGoalsCompleted for the night step
    dailyGoalsCompleted: countMatchingElements(
      watch("dayEntry.day"),
      watch("nightEntry.night")
    ),
    // Add habitActionsCount for the habits step
    habitActionsCount: countNonZeroValues(habitXpValues),
  };

  // Add counts for all steps
  formSteps.forEach((step) => {
    progressProps[`${step.type}Count`] = getFieldCount(
      step.category || "other",
      step.type
    );
  });

  return (
    <FormProvider {...methods}>
      <div className="grid grid-rows-[auto,1fr,auto] h-full">
        <FormStepProgress
          formSteps={filteredSteps}
          currentStepType={currentStep}
          handleStepChange={handleStepChange}
          progressPercentage={progressPercentage}
          {...progressProps}
        />

        <div className="h-full overflow-hidden">{currentStepComponent}</div>

        <FormStepNavigation
          availableStepsLength={filteredSteps.length}
          currentStepIndex={currentStepIndex}
          submitting={submitting}
          handlePrevForm={handlePrevForm}
          handleNextForm={handleNextForm}
        />
      </div>
    </FormProvider>
  );
}
