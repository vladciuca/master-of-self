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
  hasHabits: boolean;
};

export type JournalFormContext = UseFormReturn<JournalEntry>;

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  willpowerMultiplier,
  customSteps = [],
  hasHabits,
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

  // Create a separate effect to update willpower whenever dayEntry changes
  useEffect(() => {
    const currentEntry = getValues();

    // Calculate discipline scores
    const disciplines = getDayDisciplineScores(currentEntry.dayEntry);

    // Calculate total willpower
    const dailyWillpower = Object.values(disciplines).reduce(
      (sum, score) => sum + (score || 0),
      0
    );

    // Update the form value
    setValue(
      "dailyWillpower",
      Math.floor(dailyWillpower * willpowerMultiplier)
    );
  }, [
    // watch("dayEntry") doesn't work for this use case since the values are deeply nested
    ...Object.keys(getValues().dayEntry || {}).map((key) =>
      watch(`dayEntry.${key}`)
    ),
    ,
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
      hasHabits,
    });

    return steps;
  }, [watch, userEveningTime, customSteps, hasHabits]);

  const availableSteps = useMemo(
    () => formSteps.filter((steps) => steps.isAvailable),
    [formSteps]
  );

  // Get step list to render
  //NOTE: .discipline is basically the STEP.name
  const steps = useMemo(
    () => availableSteps.map((steps) => steps.discipline),
    [availableSteps]
  );

  // Get the current steps type from URL or use the first available steps
  const currentStep = searchParams.get("step");
  const currentStepIndex = steps.indexOf(currentStep || "");

  // This function updates the URL with the new steps
  const setStep = useCallback(
    (step: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("step", step);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Initialize the form with the correct steps
  //NOTE: Pass the availableSteps to the dependency array as hasHabits is false in the start
  useEffect(() => {
    if (!isInitialized && availableSteps.length > 0) {
      // Only change the step if there's no step parameter in the URL
      if (!currentStep) {
        setStep(steps[0]);
      }
      setIsInitialized(true);
    }
  }, [isInitialized, currentStep, steps, setStep, availableSteps.length]);

  const handleStepChange = useCallback(
    (step: string, shouldSubmit = true) => {
      // Default to true
      if (!submitting) {
        if (shouldSubmit) {
          // Get current form data
          const formData = getValues();
          // Submit the form data
          onSubmit(formData).then(() => {
            // Then change the steps
            setStep(step);
          });
        } else {
          // Just change the steps without submitting
          setStep(step);
        }
      }
    },
    [setStep, submitting, getValues, onSubmit]
  );

  const handleNextForm = useCallback(async () => {
    const formData = getValues();
    const nextIndex = currentStepIndex + 1;

    if (nextIndex < availableSteps.length) {
      await onSubmit(formData); // submits data after each steps
      handleStepChange(steps[nextIndex], false); // Don't submit again
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
    steps,
  ]);

  const handlePrevForm = useCallback(async () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      // Get current form data
      const formData = getValues();
      // Submit the form data before going back
      await onSubmit(formData);
      handleStepChange(steps[prevIndex], false); // Don't submit again
    }
  }, [currentStepIndex, handleStepChange, steps, getValues, onSubmit]);

  const progressPercentage =
    ((currentStepIndex + 1) / availableSteps.length) * 100;

  const activeStep = steps[currentStepIndex !== -1 ? currentStepIndex : 0];

  //WTF do i rename this to and what its relation to
  const activeStepComponent =
    availableSteps[currentStepIndex !== -1 ? currentStepIndex : 0]?.component;

  const progressProps = createProgressProps({
    formSteps,
    watch,
    getValues,
  });

  return (
    <FormProvider {...methods}>
      <div className="grid grid-rows-[auto,1fr,auto] h-full">
        <FormStepProgress
          formSteps={availableSteps}
          activeStep={activeStep}
          handleStepChange={handleStepChange}
          progressPercentage={progressPercentage}
          {...progressProps}
        />

        <div className="h-full overflow-hidden">{activeStepComponent}</div>

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
