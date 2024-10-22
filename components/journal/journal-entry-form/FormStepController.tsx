"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DailyBonus } from "@components/journal/journal-entry-form/form-steps/DailyBonus";
import { GreatToday } from "@components/journal/journal-entry-form/form-steps/GreatToday";
import { HowGreatWasToday } from "@components/journal/journal-entry-form/form-steps/HowGreatWasToday";
import { GratefulFor } from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import { DailyHighlights } from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import { LearnedToday } from "@components/journal/journal-entry-form/form-steps/LearnedToday";
// import { HabitsStep } from "@components/journal/journal-entry-form/form-steps/HabitsStep";
import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/HabitActionsStep";
import { FormStepProgress } from "./FormStepProgress";
import { FormStepNavigation } from "./FormStepNavigation";
import { JournalEntry } from "@/app/types/types";
import { isEvening } from "@lib/time";

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
  hasGratitude = false,
  hasReflection = false,
  hasHabits = false,
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
      dailyHighlights: journalEntryData?.nightEntry?.dailyHighlights || [],
      learnedToday: journalEntryData?.nightEntry?.learnedToday || [],
      habits: journalEntryData?.nightEntry?.habits || {},
      actions: journalEntryData?.nightEntry?.actions || {},
    },
  }));

  const calculateScore = useMemo(
    () => (entries: string[]) => {
      const totalEntries = entries.length;
      const totalLength = entries.join("").length;
      return Math.floor((totalEntries * 5 + totalLength) / 10);
    },
    []
  );

  const calculateWillpower = useMemo(
    () => (data: JournalEntry) => {
      const greatTodayScore = calculateScore(data.dayEntry?.greatToday || []);
      const gratefulForScore = calculateScore(data.dayEntry?.gratefulFor || []);
      return Math.floor((greatTodayScore + gratefulForScore) * 1.5);
    },
    [calculateScore]
  );

  // const willpowerMultiplier = 1 + formData.dailyWillpower / 100;

  // function calculateXpModifier(willpower) {
  //   // Convert the base number to a percentage (divide by 100)
  //   const percentageMultiplier = baseNumber / 100;

  //   // Calculate the result by multiplying x with (1 + percentageMultiplier)
  //   const result = x * (1 + percentageMultiplier);

  //   return result;
  // }

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
    const willpower = calculateWillpower(formData) + formData.bonusWillpower;
    if (willpower !== formData.dailyWillpower) {
      setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
    }
  }, [formData, calculateWillpower]);

  const handleChange = useCallback(
    (
      field:
        | "greatToday"
        | "gratefulFor"
        | "dailyHighlights"
        | "learnedToday"
        | "habits"
        | "actions",
      value:
        | string[]
        // | string
        | { [key: string]: number }
        | { [key: string]: { [key: string]: number } }
    ) => {
      setFormData((prev) => {
        const newData = { ...prev };
        if (field === "greatToday" || field === "gratefulFor") {
          newData.dayEntry = {
            ...prev.dayEntry,
            [field]: value as string[],
          };
        } else if (
          field === "dailyHighlights" ||
          field === "learnedToday" ||
          field === "habits" ||
          field === "actions"
        ) {
          newData.nightEntry = {
            ...prev.nightEntry,
            [field]: value,
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
        isAvailable: formData.bonusWillpower > 0,
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
            onHighlightsChange={(highlights) =>
              handleChange("dailyHighlights", highlights)
            }
            initialHighlights={formData.nightEntry?.dailyHighlights || []}
          />
        ),
        // also add if greatToday is empty in the check
        isAvailable:
          SHOW_ALL_TEST ||
          (formData.dayEntry?.greatToday && isEvening(userEveningTime)),
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
            // learnedToday={formData.nightEntry?.learnedToday || ""}
            entryList={formData.nightEntry?.learnedToday || []}
            onChange={(value) => handleChange("learnedToday", value)}
          />
        ),
        isAvailable:
          SHOW_ALL_TEST || (isEvening(userEveningTime) && hasReflection),
      },
      // {
      //   type: "habits",
      //   component: (
      //     <HabitsStep
      //       dailyWillpower={formData.dailyWillpower}
      //       onChange={(value) => handleChange("habits", value)}
      //       habitXpChanges={formData.nightEntry?.habits || {}}
      //     />
      //   ),
      //   isAvailable: SHOW_ALL_TEST || (isEvening(userEveningTime) && hasHabits),
      // },
      {
        type: "habits",
        component: (
          <HabitActionsStep
            onChange={(value) => handleChange("actions", value)}
            actionChanges={formData.nightEntry?.actions || {}}
            dailyWillpower={formData.dailyWillpower}
          />
        ),
        isAvailable: SHOW_ALL_TEST || hasHabits,
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
  const currentStepType = searchParams.get("step") || stepTypes[0];
  const currentStepIndex = stepTypes.indexOf(currentStepType);

  // This function updates the URL with the new step
  const setStep = useCallback(
    (stepType: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("step", stepType);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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
  const currentStepComponent = availableSteps[currentStepIndex].component;

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

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-full">
      <FormStepProgress
        availableSteps={availableSteps}
        currentStepType={currentStepType}
        handleStepChange={handleStepChange}
        progressPercentage={progressPercentage}
        greatTodayCount={formData.dayEntry?.greatToday?.length || 0}
        dailyGoalsToHighlights={countMatchingElements(
          formData.dayEntry?.greatToday,
          formData.nightEntry?.dailyHighlights
        )}
        gratefulForCount={formData.dayEntry?.gratefulFor?.length || 0}
        dailyHighlightsCount={formData.nightEntry?.dailyHighlights?.length || 0}
        habitActionsCount={
          Object.keys(formData.nightEntry?.actions || {}).length
        }
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
