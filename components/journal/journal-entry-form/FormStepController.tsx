import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FormStepProgressBar } from "@components/journal/journal-entry-form/FormStepProgressBar";
import { FormStepNavigation } from "@components/journal/journal-entry-form/FormStepNavigation";
import { DailyBonus } from "@components/journal/journal-entry-form/form-steps/DailyBonus";
import { GreatToday } from "@components/journal/journal-entry-form/form-steps/GreatToday";
import { GratefulFor } from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import { DailyHighlights } from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import { LearnedToday } from "@components/journal/journal-entry-form/form-steps/LearnedToday";
// import { HabitsStep } from "@components/journal/journal-entry-form/form-steps/HabitsStep";
import { HabitActionsStep } from "@components/journal/journal-entry-form/form-steps/habit-actions-step/HabitActionsStep";
import { isEvening } from "@lib/time";
import { JournalEntry } from "@app/types/types";

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

function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime = "18:00",
  hasGratitude = false,
  hasReflection = false,
  hasHabits = false,
}: FormStepControllerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JournalEntry>(() => ({
    dailyWillpower: journalEntryData?.dailyWillpower || 0,
    bonusWillpower: journalEntryData?.bonusWillpower || 0,
    dayEntry: {
      greatToday: journalEntryData?.dayEntry?.greatToday || [],
      gratefulFor: journalEntryData?.dayEntry?.gratefulFor || [],
    },
    nightEntry: {
      dailyHighlights: journalEntryData?.nightEntry?.dailyHighlights || [],
      learnedToday: journalEntryData?.nightEntry?.learnedToday || "",
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
        | string
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

  const formSteps = [
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
          learnedToday={formData.nightEntry?.learnedToday || ""}
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
        />
      ),
      isAvailable: SHOW_ALL_TEST || hasHabits,
    },
  ];

  const availableSteps = formSteps.filter((step) => step.isAvailable);
  const CurrentStepComponent = availableSteps[currentStep].component;

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-full">
      <FormStepProgressBar
        steps={availableSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      <div className="h-full overflow-hidden">{CurrentStepComponent}</div>

      <FormStepNavigation
        currentStep={currentStep}
        totalSteps={availableSteps.length}
        onSubmit={onSubmit}
        formData={formData}
        setCurrentStep={setCurrentStep}
        isSubmitting={submitting}
      />
    </div>
  );
}

const MemoizedFormStepController = React.memo(
  FormStepController,
  (prevProps, nextProps) => {
    return (
      prevProps.submitting === nextProps.submitting &&
      prevProps.userEveningTime === nextProps.userEveningTime &&
      prevProps.hasGratitude === nextProps.hasGratitude &&
      prevProps.hasReflection === nextProps.hasReflection &&
      prevProps.hasHabits === nextProps.hasHabits &&
      JSON.stringify(prevProps.journalEntryData) ===
        JSON.stringify(nextProps.journalEntryData)
    );
  }
);

export { MemoizedFormStepController as FormStepController };
