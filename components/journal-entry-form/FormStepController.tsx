import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import GreatToday from "./form-steps/GreatToday";
import DailyHighlights from "./form-steps/DailyHighlights";
import GratefulFor from "./form-steps/GratefulFor";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { FaBoltLightning } from "react-icons/fa6";

//user object will contain flags for form rendering conditions
const hasMissions = false;
const hasHabits = false;
const hasGrateful = true;

interface JournalEntry {
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
      name: "greatToday",
      type: "day",
      component: (
        <GreatToday
          entryList={formData.dayEntry?.greatToday || []}
          onChange={(value) => handleChange("greatToday", value)}
        />
      ),
      isAvailable: true,
    },
    {
      name: "gratefulFor",
      type: "day",
      component: (
        <GratefulFor
          entryList={formData.dayEntry?.gratefulFor || []}
          onChange={(value) => handleChange("gratefulFor", value)}
        />
      ),
      isAvailable: hasGrateful,
    },
    {
      name: "dailyHighlights",
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
      <div className="text-center mb-2">
        <h2 className="text-4xl font-semibold flex items-center justify-center">
          {formData.dailyWillpower}
          <FaBoltLightning className="ml-2" />
        </h2>
      </div>
      <div className="mb-3">
        <FormStepProgressBar steps={availableSteps} currentStep={currentStep} />
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
          {currentStep === availableSteps.length - 1 ? "Submit" : "Next"}
          <RxChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FormStepController);
