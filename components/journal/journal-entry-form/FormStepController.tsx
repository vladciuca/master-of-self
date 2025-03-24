"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm, FormProvider, UseFormReturn } from "react-hook-form";

import { Bonus } from "@components/journal/journal-entry-form/form-steps/steps/bonus/Bonus";
import { Day } from "@components/journal/journal-entry-form/form-steps/steps/Day";
import { Night } from "@components/journal/journal-entry-form/form-steps/steps/Night";
import { Gratitude } from "@components/journal/journal-entry-form/form-steps/steps/Gratitude";
import { Affirmations } from "./form-steps/steps/Affirmations";
import { Highlights } from "@components/journal/journal-entry-form/form-steps/steps/Highlights";
import { Reflection } from "@components/journal/journal-entry-form/form-steps/steps/Reflection";
import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/steps/HabitActionsStep";
import { FormStepProgress } from "./FormStepProgress";
import { FormStepNavigation } from "./FormStepNavigation";
import { JournalEntry } from "@models/types";
import { isEvening } from "@lib/time";
import { calculateWillpowerScore } from "@lib/score";
import { calculateHabitsXpFromEntry } from "@lib/level";

// TEST_FLAG: used for enabling all forms steps
const SHOW_ALL_TEST = true;

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  userEveningTime?: string;
  hasHabits?: boolean;
  hasGratitude?: boolean;
  hasAffirmations?: boolean;
  hasReflection?: boolean;
};

export type JournalFormContext = UseFormReturn<JournalEntry>;

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  hasGratitude = false,
  hasAffirmations = false,
  hasReflection = false,
  hasHabits = false,
}: FormStepControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize React Hook Form with default values
  const methods = useForm<JournalEntry>({
    defaultValues: {
      dailyWillpower: journalEntryData?.dailyWillpower || 0,
      bonusWillpower: journalEntryData?.bonusWillpower || 0,
      dayEntry: {
        day: journalEntryData?.dayEntry?.day || [],
        gratitude: journalEntryData?.dayEntry?.gratitude || [],
        affirmations: journalEntryData?.dayEntry?.affirmations || [],
      },
      nightEntry: {
        night: journalEntryData?.nightEntry?.night || [],
        highlights: journalEntryData?.nightEntry?.highlights || [],
        reflection: journalEntryData?.nightEntry?.reflection || [],
      },
      habits: journalEntryData?.habits || {},
    },
  });

  // Get form values and methods
  const { watch, setValue, getValues } = methods;

  // NOTE: TS type checking is static and happening at compile time, not runtime.
  // The TypeScript compiler doesn't know about the runtime behavior of React Hook Form
  // This is why we must set a fallback value to be able to use in isAvailable step condition
  const day = watch("dayEntry.day") || [];
  const gratitude = watch("dayEntry.gratitude");
  const affirmations = watch("dayEntry.affirmations");

  // Get daily WP form day step forms
  //NOTE: for the new system this should be refactored in a simple calculation
  const calculateDailyWillpower = useCallback(
    (
      dayList: string[],
      gratitudeList: string[],
      affirmationsList: string[]
    ) => {
      const dayScore = calculateWillpowerScore(dayList || []);
      const gratitudeScore = calculateWillpowerScore(gratitudeList || []);
      const affirmationsScore = calculateWillpowerScore(affirmationsList || []);
      //NOTE: the multiplier here is not applied to yday entry when calculating WP
      // when this becomes a constant multiply var should be added in the function itself
      return Math.floor((dayScore + gratitudeScore) * 1.5);
    },
    []
  );

  // Update form data when journalEntryData changes
  useEffect(() => {
    if (journalEntryData) {
      // Update all form fields with new data
      setValue("dailyWillpower", journalEntryData.dailyWillpower || 0);
      setValue("bonusWillpower", journalEntryData.bonusWillpower || 0);

      if (journalEntryData.dayEntry) {
        setValue("dayEntry.day", journalEntryData.dayEntry.day || []);
        setValue(
          "dayEntry.gratitude",
          journalEntryData.dayEntry.gratitude || []
        );
        setValue(
          "dayEntry.gratitude",
          journalEntryData.dayEntry.affirmations || []
        );
      }

      if (journalEntryData.nightEntry) {
        setValue("nightEntry.night", journalEntryData.nightEntry.night || []);
        setValue(
          "nightEntry.highlights",
          journalEntryData.nightEntry.highlights || []
        );
        setValue(
          "nightEntry.reflection",
          journalEntryData.nightEntry.reflection || []
        );
      }

      if (journalEntryData.habits) {
        setValue("habits", journalEntryData.habits);
      }
    }
  }, [journalEntryData, setValue]);

  // Update willpower when relevant fields change
  useEffect(() => {
    const willpower = calculateDailyWillpower(
      day || [],
      gratitude || [],
      affirmations || []
    );
    setValue("dailyWillpower", willpower);
  }, [day, gratitude, affirmations, calculateDailyWillpower, setValue]);

  const formSteps = useMemo(
    () => [
      {
        type: "bonus",
        component: <Bonus />,
        isAvailable:
          SHOW_ALL_TEST ||
          (!isEvening(userEveningTime) && watch("bonusWillpower") > 0),
      },
      {
        type: "gratitude",
        component: <Gratitude />,
        isAvailable:
          SHOW_ALL_TEST || (!isEvening(userEveningTime) && hasGratitude),
      },
      {
        type: "day",
        component: <Day />,
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      },
      {
        type: "affirmations",
        component: <Affirmations />,
        isAvailable:
          SHOW_ALL_TEST || (!isEvening(userEveningTime) && hasAffirmations),
      },
      {
        type: "night",
        component: <Night />,
        isAvailable:
          SHOW_ALL_TEST || (isEvening(userEveningTime) && day?.length > 0),
      },
      {
        type: "highlights",
        component: <Highlights />,
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
      },
      {
        type: "reflection",
        component: <Reflection />,
        isAvailable:
          SHOW_ALL_TEST || (isEvening(userEveningTime) && hasReflection),
      },
      {
        type: "habits",
        component: <HabitActionsStep />,
        isAvailable: hasHabits,
      },
    ],
    [watch, userEveningTime, hasGratitude, hasReflection, hasHabits]
  );

  const availableSteps = useMemo(
    () => formSteps.filter((step) => step.isAvailable),
    [formSteps]
  );

  const stepTypes = useMemo(
    () => availableSteps.map((step) => step.type),
    [availableSteps]
  );

  // Get the current step type from URL or use the first available step
  const currentStepType = searchParams.get("step");
  const currentStepIndex = stepTypes.indexOf(currentStepType || "");

  // Use a valid step index or default to 0
  // const safeCurrentStepIndex = currentStepIndex !== -1 ? currentStepIndex : 0;

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
    if (!isInitialized && availableSteps.length > 0) {
      const initialStepType =
        currentStepType && stepTypes.includes(currentStepType)
          ? currentStepType
          : stepTypes[0];
      setStep(initialStepType);
      setIsInitialized(true);
    }
  }, [isInitialized, availableSteps, currentStepType, stepTypes, setStep]);

  const handleStepChange = useCallback(
    (stepType: string) => {
      if (!submitting) {
        setStep(stepType);
      }
    },
    [setStep, submitting]
  );

  const handleNextForm = useCallback(async () => {
    const formData = getValues();
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < availableSteps.length) {
      await onSubmit(formData); // submits data after each step
      handleStepChange(stepTypes[nextIndex]);
    } else {
      await onSubmit(formData);
      router.push("/journal");
    }
  }, [
    currentStepIndex,
    availableSteps.length,
    getValues,
    onSubmit,
    handleStepChange,
    router,
    stepTypes,
  ]);

  // Updated handlePrevForm to use stepTypes
  const handlePrevForm = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      handleStepChange(stepTypes[prevIndex]);
    }
  }, [currentStepIndex, handleStepChange, stepTypes]);

  const progressPercentage =
    ((currentStepIndex + 1) / availableSteps.length) * 100;

  const currentStep = stepTypes[currentStepIndex !== -1 ? currentStepIndex : 0];

  const currentStepComponent =
    availableSteps[currentStepIndex !== -1 ? currentStepIndex : 0]?.component;

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

  return (
    <FormProvider {...methods}>
      <div className="grid grid-rows-[auto,1fr,auto] h-full">
        <FormStepProgress
          availableSteps={availableSteps}
          currentStepType={currentStep}
          handleStepChange={handleStepChange}
          progressPercentage={progressPercentage}
          dayCount={watch("dayEntry.day")?.length || 0}
          dailyGoalsCompleted={countMatchingElements(
            watch("dayEntry.day"),
            watch("nightEntry.night")
          )}
          gratitudeCount={watch("dayEntry.gratitude")?.length || 0}
          affirmationsCount={watch("dayEntry.affirmations")?.length || 0}
          highlightsCount={watch("nightEntry.highlights")?.length || 0}
          reflectionCount={watch("nightEntry.reflection")?.length || 0}
          habitActionsCount={countNonZeroValues(habitXpValues)}
        />

        <div className="h-full overflow-hidden">{currentStepComponent}</div>

        <FormStepNavigation
          availableStepsLength={availableSteps.length}
          currentStepIndex={currentStepIndex}
          submitting={submitting}
          handlePrevForm={handlePrevForm}
          handleNextForm={handleNextForm}
        />
      </div>
    </FormProvider>
  );
}
