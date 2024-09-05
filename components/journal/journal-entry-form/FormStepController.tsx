import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "@components/journal/journal-entry-form/FormStepProgressBar";
import DailyBonus from "@components/journal/journal-entry-form/form-steps/DailyBonus";
import GreatToday from "@components/journal/journal-entry-form/form-steps/GreatToday";
import GratefulFor from "@components/journal/journal-entry-form/form-steps/GratefulFor";
import DailyHighlights from "@components/journal/journal-entry-form/form-steps/DailyHighlights";
import LearnedToday from "@components/journal/journal-entry-form/form-steps/LearnedToday";
import HabitsStep from "@components/journal/journal-entry-form/form-steps/HabitsStep";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { JournalEntry } from "@app/types/types";

//user object will contain flags for form rendering conditions
const hasMissions = false;
const hasHabits = true;
const hasGratitude = true;
const hasReflection = true;
const isDefault = true;
const eveningStartingHour = "18:00";
// evening Flag check
function isEvening() {
  const currentHour = new Date().getHours();
  const eveningStartHour = parseInt(eveningStartingHour.split(":")[0]);

  if (currentHour >= eveningStartHour) {
    return true;
  } else {
    return false;
  }
}

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
};

const FormStepController = ({
  journalEntryData,
  submitting,
  onSubmit,
}: FormStepControllerProps) => {
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
    },
  }));
  // const [habitXpUpdates, setHabitXpUpdates] = useState<{
  //   [key: string]: number;
  // }>({});
  const router = useRouter();

  const calculateScore = useCallback((entries: string[]) => {
    const totalEntries = entries.length;
    const totalLength = entries.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  }, []);

  const calculateWillpower = useCallback(
    (data: JournalEntry) => {
      const greatTodayScore = calculateScore(data.dayEntry?.greatToday || []);
      const gratefulForScore = calculateScore(data.dayEntry?.gratefulFor || []);
      return Math.floor((greatTodayScore + gratefulForScore) * 1.5);
    },
    [calculateScore]
  );

  // const onHabitXpUpdate = (habitId: string, xp: number) => {
  //   setHabitXpUpdates((prev) => ({
  //     ...prev,
  //     [habitId]: (prev[habitId] || 0) + xp,
  //   }));
  // };

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
      field: "greatToday" | "gratefulFor" | "dailyHighlights" | "learnedToday",
      value: string[] | string
    ) => {
      setFormData((prev) => {
        const newData = { ...prev };
        if (field === "greatToday" || field === "gratefulFor") {
          newData.dayEntry = {
            ...prev.dayEntry,
            [field]: value as string[],
          };
        } else if (field === "dailyHighlights" || field === "learnedToday") {
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

  const handleStepClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => {
    setCurrentStep(index);
  };

  const handleCloseForm = () => {
    router.push("/journal");
  };

  const handleNextForm = useCallback(async () => {
    if (currentStep < availableSteps.length - 1) {
      await onSubmit(formData);
      // Update habit XP
      // for (const [habitId, xp] of Object.entries(habitXpUpdates)) {
      //   await fetch(`/api/habits/${habitId}/xp`, {
      //     method: "PATCH",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ xp }),
      //   });
      // }
      // setHabitXpUpdates({}); // Reset after updating
      setCurrentStep((step) => step + 1);
    } else {
      await onSubmit(formData);
      handleCloseForm();
    }
  }, [currentStep, formData, onSubmit, router]);

  const handlePrevForm = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  }, [currentStep]);

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
      isAvailable: hasGratitude,
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
      isAvailable: isDefault,
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
      isAvailable: isEvening(),
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
      isAvailable: isEvening() && hasReflection,
    },
    {
      name: "How did I use my Willpower today?",
      type: "habits",
      component: (
        <HabitsStep
          dailyWillpower={formData.dailyWillpower}
          // onHabitXpUpdate={onHabitXpUpdate}
        />
      ),
      isAvailable: hasHabits,
    },
    {
      name: "missionProgress",
      type: "night",
      component: <>missionProgress</>,
      isAvailable: hasMissions,
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
        handleStepClick={handleStepClick}
      />
      <div className="text-center mt-6 mb-2">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0 leading-relaxed">
            {componentName}
          </h2>
        </div>
      </div>
      <div className="overflow-y-auto">{CurrentStepComponent}</div>
      <div className="flex justify-around items-center my-4">
        <Button
          className="w-1/3"
          variant={currentStep === 0 ? "secondary" : "default"}
          type="button"
          onClick={currentStep === 0 ? handleCloseForm : handlePrevForm}
        >
          <RxChevronLeft />
          {currentStep === 0 ? "Cancel" : "Back"}
        </Button>

        <Button
          className="w-1/3"
          variant={
            currentStep === availableSteps.length - 1 ? "secondary" : "default"
          }
          type="button"
          onClick={handleNextForm}
          disabled={submitting}
        >
          {currentStep === availableSteps.length - 1 ? "Complete" : "Next"}
          <RxChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FormStepController);
