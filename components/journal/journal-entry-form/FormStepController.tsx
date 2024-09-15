import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FormStepProgressBar } from "@components/journal/journal-entry-form/FormStepProgressBar";
import { FormStepNavigation } from "@components/journal/journal-entry-form/FormStepNavigation";
import { DailyBonus } from "@components/journal/journal-entry-form/form-steps/DailyBonus";
import { GreatToday } from "@components/journal/journal-entry-form/form-steps/GreatToday";
import { GratefulFor } from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import { DailyHighlights } from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import { LearnedToday } from "@components/journal/journal-entry-form/form-steps/LearnedToday";
import { HabitsStep } from "@components/journal/journal-entry-form/form-steps/HabitsStep";
import { JournalEntry } from "@app/types/types";

// TEST_FLAG: used for enabling all forms steps
const SHOW_ALL_TEST = false;

function isEvening(startHour: string | undefined): boolean {
  if (!startHour) return false;
  const currentHour = new Date().getHours();
  const eveningStartHour = parseInt(startHour.split(":")[0]);
  return currentHour >= eveningStartHour;
}

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
  userEveningTime?: string;
  hasHabits: boolean;
  hasGratitude: boolean;
  hasReflection: boolean;
};

function FormStepController({
  journalEntryData,
  submitting,
  onSubmit,
  userEveningTime,
  hasGratitude,
  hasReflection,
  hasHabits,
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
        | "habits",
      value: string[] | string | { [key: string]: number }
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
          field === "habits"
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
      name: "Bonus Willpower",
      type: "reward",
      component: <DailyBonus bonusWillpower={formData.bonusWillpower} />,
      isAvailable: formData.bonusWillpower > 0,
    },
    {
      name: "What am I feeling grateful for?",
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
      name: "What will I do to make today great?",
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
      name: "What are today's highlights?",
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
      name: "What have I learned today?",
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
    {
      name: "How did I manage my Willpower?",
      type: "habits",
      component: (
        <HabitsStep
          dailyWillpower={formData.dailyWillpower}
          onChange={(value) => handleChange("habits", value)}
          habitXpChanges={formData.nightEntry?.habits || {}}
        />
      ),
      isAvailable: SHOW_ALL_TEST || (isEvening(userEveningTime) && hasHabits),
    },
  ];

  const availableSteps = formSteps.filter((step) => step.isAvailable);
  const componentName = availableSteps[currentStep].name;
  const CurrentStepComponent = availableSteps[currentStep].component;

  return (
    <div className="grid grid-rows-[auto,auto,1fr,auto] h-full">
      <FormStepProgressBar
        steps={availableSteps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
      />

      <div className="text-center mt-6 mb-2">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0 leading-relaxed">
            {componentName}
          </h2>
        </div>
      </div>
      <div className="overflow-y-auto">{CurrentStepComponent}</div>

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
