import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import GreatToday from "./form-steps/GreatToday";
import DailyHighlights from "./form-steps/DailyHighlights";
import GratefulFor from "./form-steps/GratefulFor";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
// import { FaBoltLightning } from "react-icons/fa6";

//user object will contain flags for form rendering conditions
const hasMissions = false;
const hasHabits = false;
const hasGrateful = true;

export interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: {
    greatToday?: string[];
    gratefulFor?: string[];
  };
  nightEntry?: {
    dailyHighlights?: string[];
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
  const [formData, setFormData] = useState<JournalEntry>(
    journalEntryData || {
      dailyWillpower: 0,
      dayEntry: {
        greatToday: [],
        gratefulFor: [],
      },
      nightEntry: {
        dailyHighlights: [],
      },
    }
  );
  const router = useRouter();

  const calculateScore = useCallback((entries: string[]) => {
    const totalEntries = entries.length;
    const totalLength = entries.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  }, []);

  const calculateWillpower = useCallback(
    (formData: JournalEntry) => {
      const greatTodayScore = calculateScore(
        formData.dayEntry?.greatToday || []
      );
      const gratefulForScore = calculateScore(
        formData.dayEntry?.gratefulFor || []
      );
      return Math.floor((greatTodayScore + gratefulForScore) * 1.5); // Example calculation, adjust as needed
    },
    [calculateScore]
  );

  useEffect(() => {
    if (journalEntryData) {
      setFormData(journalEntryData);
    }
  }, [journalEntryData]);

  useEffect(() => {
    const willpower = calculateWillpower(formData);
    if (willpower !== formData.dailyWillpower) {
      setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
    }
  }, [formData, calculateWillpower]);

  const handleChange = useCallback(
    (
      field: "greatToday" | "gratefulFor" | "dailyHighlights",
      value: string[]
    ) => {
      setFormData((prev) => {
        if (field === "dailyHighlights") {
          return {
            ...prev,
            nightEntry: { ...prev.nightEntry, dailyHighlights: value },
          };
        } else {
          return {
            ...prev,
            dayEntry: {
              ...prev.dayEntry,
              [field]: value,
            },
          };
        }
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
      name: "Claim BONUS Willpower from yesterday's highlights!",
      type: "reward",
      component: <>BONUS WILLPOWER</>,
      isAvailable: true,
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
      name: "What are you feeling grateful for?",
      type: "day",
      component: (
        <GratefulFor
          dailyWillpower={formData.dailyWillpower}
          entryList={formData.dayEntry?.gratefulFor || []}
          onChange={(value) => handleChange("gratefulFor", value)}
        />
      ),
      isAvailable: hasGrateful,
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

  const CurrentStepComponent = availableSteps[currentStep].component;

  return (
    <div className="grid grid-rows-[auto,auto,1fr,auto] h-full">
      <FormStepProgressBar steps={availableSteps} currentStep={currentStep} />
      <div className="text-center mt-6 px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0 leading-relaxed">
            {availableSteps[currentStep].name}
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
          Prev
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
