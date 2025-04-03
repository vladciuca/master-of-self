"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { FormStepProgress } from "./FormStepProgress";
import { FormStepNavigation } from "./FormStepNavigation";
import { JournalEntry, JournalEntryCustomStep } from "@models/types";
import { getDayDisciplineScores } from "@lib/score";
import {
  createSteps,
  creteFormDefaultValues,
  createProgressProps,
} from "./form-steps/StepConfig";

// TEST_FLAG: used for enabling all forms steps
const SHOW_ALL_TEST = true;

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  userEveningTime?: string;
  willpowerMultiplier: number;
  customSteps?: JournalEntryCustomStep[];
};

export type JournalFormContext = UseFormReturn<JournalEntry>;

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  willpowerMultiplier,
  customSteps = [],
}: FormStepControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Create form with default values
  const methods = useForm<JournalEntry>({
    defaultValues: creteFormDefaultValues({ journalEntryData, customSteps }),
  });

  // Get form values and methods
  const { watch, setValue, getValues } = methods;

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
    watch("dayEntry"),
    watch("nightEntry"),
    setValue,
    getValues,
    willpowerMultiplier,
  ]);

  // Update form when data changes
  useEffect(() => {
    if (journalEntryData) {
      // Update basic fields
      setValue("dailyWillpower", journalEntryData.dailyWillpower ?? 0);
      setValue("bonusWillpower", journalEntryData.bonusWillpower ?? 0);

      // Update day and night entries
      if (journalEntryData.dayEntry) {
        Object.entries(journalEntryData.dayEntry).forEach(([field, value]) => {
          setValue(`dayEntry.${field}`, value ?? []);
        });
      }

      if (journalEntryData.nightEntry) {
        Object.entries(journalEntryData.nightEntry).forEach(
          ([field, value]) => {
            setValue(`nightEntry.${field}`, value ?? []);
          }
        );
      }

      // Update habits
      if (journalEntryData.habits) {
        setValue("habits", journalEntryData.habits);
      }
    }
  }, [journalEntryData, setValue]);

  // Get all form steps
  const formSteps = useMemo(() => {
    const steps = createSteps({
      watch,
      userEveningTime,
      SHOW_ALL_TEST,
      customSteps,
    });

    return steps;
  }, [watch, userEveningTime, customSteps]);

  // Filter to available steps only
  const filteredSteps = useMemo(
    () => formSteps.filter((step) => step.isAvailable),
    [formSteps]
  );

  //NOTE: type will become discipline
  // Get array of step types
  // HMMM SO STEP TYPES NOW BECAME DISCIPLINES, but for other pages they are they can be ?
  //Just leave it STEP? or STEP_IDENTIFIER? something step is best I think
  const step = useMemo(
    () => filteredSteps.map((step) => step.discipline),
    [filteredSteps]
  );

  // Get the current step type from URL or use the first available step
  //WTF do i rename this to and what its relation to
  const currentStepType = searchParams.get("step");
  const currentStepIndex = step.indexOf(currentStepType || "");

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
        currentStepType && step.includes(currentStepType)
          ? currentStepType
          : step[0];
      setStep(initialStepType);
      setIsInitialized(true);
    }
  }, [isInitialized, currentStepType, step, setStep]);

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
      handleStepChange(step[nextIndex], false); // Don't submit again
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
    step,
  ]);

  const handlePrevForm = useCallback(async () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      // Get current form data
      const formData = getValues();
      // Submit the form data before going back
      await onSubmit(formData);
      handleStepChange(step[prevIndex], false); // Don't submit again
    }
  }, [currentStepIndex, handleStepChange, step, getValues, onSubmit]);

  const progressPercentage =
    ((currentStepIndex + 1) / filteredSteps.length) * 100;

  const currentStep = step[currentStepIndex !== -1 ? currentStepIndex : 0];

  //WTF do i rename this to and what its relation to
  const currentStepComponent =
    filteredSteps[currentStepIndex !== -1 ? currentStepIndex : 0]?.component;

  const progressProps = createProgressProps({
    formSteps,
    watch,
    getValues,
  });

  return (
    <FormProvider {...methods}>
      <div className="grid grid-rows-[auto,1fr,auto] h-full">
        <FormStepProgress
          formSteps={filteredSteps}
          currentStep={currentStep}
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
