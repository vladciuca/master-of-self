"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DailyBonus } from "@components/journal/journal-entry-form/form-steps/daily-bonus/DailyBonus";
import { GreatToday } from "@components/journal/journal-entry-form/form-steps/GreatToday";
import { HowGreatWasToday } from "@components/journal/journal-entry-form/form-steps/HowGreatWasToday";
import { GratefulFor } from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import { DailyHighlights } from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import { LearnedToday } from "@components/journal/journal-entry-form/form-steps/LearnedToday";
import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/HabitActionsStep";
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
  hasReflection?: boolean;
};

export function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  hasGratitude = true,
  hasReflection = true,
  hasHabits = true,
}: FormStepControllerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<JournalEntry>(() => ({
    dailyWillpower: journalEntryData?.dailyWillpower || 0,
    bonusWillpower: journalEntryData?.bonusWillpower || 0,
    dayEntry: {
      greatToday: journalEntryData?.dayEntry?.greatToday || [],
      gratefulFor: journalEntryData?.dayEntry?.gratefulFor || [],
    },
    nightEntry: {
      howGreatToday: journalEntryData?.nightEntry?.howGreatToday || [],
      dailyHighlights: journalEntryData?.nightEntry?.dailyHighlights || [],
      learnedToday: journalEntryData?.nightEntry?.learnedToday || [],
    },
    habits: journalEntryData?.habits || {},
  }));
  const [isInitialized, setIsInitialized] = useState(false);

  // Get daily WP form day step forms
  const calculateDailyWillpower = useCallback((data: JournalEntry) => {
    const greatTodayScore = calculateWillpowerScore(
      data.dayEntry?.greatToday || []
    );
    const gratefulForScore = calculateWillpowerScore(
      data.dayEntry?.gratefulFor || []
    );
    return Math.floor((greatTodayScore + gratefulForScore) * 1.5);
  }, []);

  // do i have to add the habits key here?
  useEffect(() => {
    if (journalEntryData) {
      setFormData((prev) => ({
        ...prev,
        ...journalEntryData,
        dayEntry: {
          ...prev.dayEntry,
          ...journalEntryData.dayEntry,
        },
        nightEntry: {
          ...prev.nightEntry,
          ...journalEntryData.nightEntry,
        },
      }));
    }
  }, [journalEntryData]);

  useEffect(() => {
    const willpower = calculateDailyWillpower(formData);
    if (willpower !== formData.dailyWillpower) {
      setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
    }
  }, [formData, calculateDailyWillpower]);

  const handleChange = useCallback(
    (
      field:
        | "gratefulFor"
        | "greatToday"
        | "howGreatToday"
        | "dailyHighlights"
        | "learnedToday"
        | "habits",
      value: string[] | { [key: string]: { [key: string]: number } }
    ) => {
      setFormData((prev) => {
        const newData = { ...prev };
        if (field === "greatToday" || field === "gratefulFor") {
          newData.dayEntry = {
            ...prev.dayEntry,
            [field]: value as string[],
          };
        } else if (
          field === "howGreatToday" ||
          field === "dailyHighlights" ||
          field === "learnedToday"
        ) {
          newData.nightEntry = {
            ...prev.nightEntry,
            [field]: value as string[],
          };
        } else if (field === "habits") {
          newData.habits = {
            ...prev.habits,
            ...(value as { [key: string]: { [key: string]: number } }),
          };
        }
        return newData;
      });
    },
    []
  );

  const formSteps = useMemo(
    () => [
      {
        type: "reward",
        component: <DailyBonus bonusWillpower={formData.bonusWillpower} />,
        isAvailable:
          SHOW_ALL_TEST ||
          (!isEvening(userEveningTime) && formData.bonusWillpower > 0),
      },
      {
        type: "gratitude",
        component: (
          <GratefulFor
            dailyWillpower={formData.dailyWillpower}
            entryList={formData.dayEntry?.gratefulFor || []}
            onChange={(value) => handleChange("gratefulFor", value)}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST || (!isEvening(userEveningTime) && hasGratitude),
      },
      {
        type: "day",
        component: (
          <GreatToday
            dailyWillpower={formData.dailyWillpower}
            entryList={formData.dayEntry?.greatToday || []}
            onChange={(value) => handleChange("greatToday", value)}
          />
        ),
        isAvailable: SHOW_ALL_TEST || !isEvening(userEveningTime),
      },
      {
        type: "night",
        component: (
          <HowGreatWasToday
            greatToday={formData.dayEntry?.greatToday || []}
            onHowGreatTodayChange={(howGreatToday) =>
              handleChange("howGreatToday", howGreatToday)
            }
            initialHowGreatToday={formData.nightEntry?.howGreatToday || []}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST ||
          (isEvening(userEveningTime) &&
            (formData.dayEntry?.greatToday?.length || 0) > 0),
      },
      {
        type: "highlights",
        component: (
          <DailyHighlights
            entryList={formData.nightEntry?.dailyHighlights || []}
            onChange={(value) => handleChange("dailyHighlights", value)}
          />
        ),
        isAvailable: SHOW_ALL_TEST || isEvening(userEveningTime),
      },
      {
        type: "reflection",
        component: (
          <LearnedToday
            entryList={formData.nightEntry?.learnedToday || []}
            onChange={(value) => handleChange("learnedToday", value)}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST || (isEvening(userEveningTime) && hasReflection),
      },
      {
        type: "habits",
        component: (
          <HabitActionsStep
            onChange={(value) => handleChange("habits", value)}
            actionChanges={formData.habits || {}}
            totalWillpower={formData.dailyWillpower + formData.bonusWillpower}
          />
        ),
        isAvailable: hasHabits,
      },
    ],
    [
      formData,
      handleChange,
      userEveningTime,
      hasGratitude,
      hasReflection,
      hasHabits,
    ]
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

  // Use setStep instead of updateUrlStep
  const handleStepChange = useCallback(
    (stepType: string) => {
      if (!submitting) {
        setStep(stepType);
      }
    },
    [setStep, submitting]
  );

  // Updated handleNextForm to use stepTypes
  const handleNextForm = useCallback(async () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < availableSteps.length) {
      await onSubmit(formData);
      handleStepChange(stepTypes[nextIndex]);
    } else {
      await onSubmit(formData);
      router.push("/journal");
    }
  }, [
    currentStepIndex,
    availableSteps.length,
    formData,
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
  function countMatchingElements(
    arr1: string[] | undefined,
    arr2: string[] | undefined
  ) {
    const safeArr1 = arr1 || [];
    const safeArr2 = arr2 || [];
    const set1 = new Set(safeArr1);
    return safeArr2.filter((element) => set1.has(element)).length;
  }

  const habitXpValues = calculateHabitsXpFromEntry(
    formData.habits || {},
    formData.dailyWillpower
  );

  // NOTE: move to util when cleaning up this file
  const countNonZeroValues = (obj: Record<string, number>) =>
    Object.values(obj).filter((value) => value !== 0).length;

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-full">
      <FormStepProgress
        availableSteps={availableSteps}
        currentStepType={currentStep}
        handleStepChange={handleStepChange}
        progressPercentage={progressPercentage}
        greatTodayCount={formData.dayEntry?.greatToday?.length || 0}
        dailyGoalsCompleted={countMatchingElements(
          formData.dayEntry?.greatToday,
          formData.nightEntry?.howGreatToday
        )}
        gratefulForCount={formData.dayEntry?.gratefulFor?.length || 0}
        dailyHighlightsCount={formData.nightEntry?.dailyHighlights?.length || 0}
        habitActionsCount={countNonZeroValues(habitXpValues)}
        learnedTodayCount={formData.nightEntry?.learnedToday?.length || 0}
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
  );
}
