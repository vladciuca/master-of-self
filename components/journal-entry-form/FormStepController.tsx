import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import DailyBonus from "./form-steps/DailyBonus";
import GreatToday from "./form-steps/GreatToday";
import GratefulFor from "./form-steps/GratefulFor";
import DailyHighlights from "./form-steps/DailyHighlights";
import LearnedToday from "./form-steps/LearnedToday";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

//user object will contain flags for form rendering conditions
const hasMissions = false;
const hasHabits = false;
const hasGratitude = true;
const hasReflection = true;

export interface JournalEntry {
  dailyWillpower: number;
  bonusWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
    learnedToday?: string;
  };
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
  const router = useRouter();

  // const eveningStartingHour = "18:00";
  // const isEvening = () => {
  //   const now = new Date();
  //   const currentHour = now.getHours();
  //   const currentMinute = now.getMinutes();

  //   const [eveningHour, eveningMinute] = eveningStartingHour
  //     .split(":")
  //     .map(Number);

  //   return (
  //     currentHour > eveningHour ||
  //     (currentHour === eveningHour && currentMinute >= eveningMinute)
  //   );
  // };

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

  const next = useCallback(async () => {
    if (currentStep < availableSteps.length - 1) {
      await onSubmit(formData);
      setCurrentStep((step) => step + 1);
    } else {
      await onSubmit(formData);
      router.push("/journal");
    }
  }, [currentStep, formData, onSubmit, router]);

  const prev = useCallback(() => {
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
      name: "What are you feeling grateful for?",
      type: "day",
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
      name: "What will make today great?",
      type: "day",
      component: (
        <GreatToday
          dailyWillpower={formData.dailyWillpower}
          entryList={formData.dayEntry?.greatToday || []}
          onChange={(value) => handleChange("greatToday", value)}
        />
      ),
      isAvailable: true,
    },

    {
      name: "What are your highlights of the day?",
      type: "night",
      component: (
        <DailyHighlights
          entryList={formData.nightEntry?.dailyHighlights || []}
          onChange={(value) => handleChange("dailyHighlights", value)}
        />
      ),
      isAvailable: true,
    },
    {
      name: "What have I learned today?",
      type: "night",
      component: (
        <LearnedToday
          learnedToday={formData.nightEntry?.learnedToday || ""}
          onChange={(value) => handleChange("learnedToday", value)}
        />
      ),
      isAvailable: hasReflection,
    },
    {
      name: "habitWillpower",
      type: "night",
      component: <>habitWillpower</>,
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
      <FormStepProgressBar steps={availableSteps} currentStep={currentStep} />
      <div className="text-center mt-6 mb-2">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0 leading-relaxed">
            {componentName}
          </h2>
        </div>
      </div>
      <div className="overflow-y-auto">{CurrentStepComponent}</div>
      <div className="flex justify-around items-center  my-4">
        <Button
          className="w-1/3"
          type="button"
          onClick={prev}
          disabled={currentStep === 0}
        >
          <RxChevronLeft />
          Back
        </Button>
        <Button
          className="w-1/3"
          type="button"
          onClick={next}
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
