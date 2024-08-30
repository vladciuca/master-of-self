import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import GreatToday from "./form-steps/GreatToday";
import DailyHighlights from "./form-steps/DailyHighlights";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { FaBoltLightning } from "react-icons/fa6";

//user object will contain flags for form rendering conditions
const hasMissions = false;
const hasHabits = false;
const hasGrateful = false;

interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: { greatToday: string[]; score?: number };
  nightEntry?: { dailyHighlights: string[]; score?: number };
}

type FormStepControllerProps = {
  submitting: boolean;
  onSubmit: (journalEntry: JournalEntry) => Promise<void>;
  journalEntryData?: JournalEntry;
};

const FormStepController: React.FC<FormStepControllerProps> = ({
  journalEntryData,
  submitting,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(
    journalEntryData || {
      dailyWillpower: 0,
      dayEntry: { greatToday: [], score: 0 },
      nightEntry: { dailyHighlights: [], score: 0 },
    }
  );
  const router = useRouter();

  useEffect(() => {
    if (journalEntryData) {
      setFormData(journalEntryData);
    }
  }, [journalEntryData]);

  useEffect(() => {
    const totalScore =
      (formData.dayEntry?.score || 0) + (formData.nightEntry?.score || 0);
    const willpower = Math.floor(totalScore * 1.5); // Example calculation, adjust as needed
    if (willpower !== formData.dailyWillpower) {
      setFormData((prev) => ({ ...prev, dailyWillpower: willpower }));
    }
  }, [
    formData.dayEntry?.score,
    formData.nightEntry?.score,
    formData.dailyWillpower,
  ]);

  const handleChange = useCallback(
    (
      field: "dayEntry" | "nightEntry",
      value: { greatToday: string[] } | { dailyHighlights: string[] },
      score: number
    ) => {
      setFormData((prev) => {
        if (
          JSON.stringify(prev[field]) !== JSON.stringify({ ...value, score })
        ) {
          return { ...prev, [field]: { ...value, score } };
        }
        return prev;
      });
    },
    []
  );

  const next = useCallback(async () => {
    if (currentStep < formSteps.length - 1) {
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
          dayEntry={formData.dayEntry?.greatToday || []}
          onChange={handleChange}
        />
      ),
      renderCondition: true,
    },
    {
      name: "dailyHighlights",
      type: "night",
      component: (
        <DailyHighlights
          nightEntry={formData.nightEntry?.dailyHighlights || []}
          onChange={handleChange}
        />
      ),
      renderCondition: true,
    },
    {
      name: "gratefulFor",
      type: "day",
      component: <>gratefulFor</>,
      renderCondition: hasGrateful,
    },
    {
      name: "habitWillpower",
      type: "night",
      component: <>habitWillpower</>,
      renderCondition: hasHabits,
    },
  ];

  const CurrentStepComponent = formSteps[currentStep].component;

  return (
    <div className="grid grid-rows-[auto,auto,1fr,auto] h-full">
      <div className="text-center mb-2">
        <h2 className="text-4xl font-semibold flex items-center justify-center">
          {formData.dailyWillpower}
          <FaBoltLightning className="ml-2" />
        </h2>
      </div>
      <div className="mb-3">
        <FormStepProgressBar steps={formSteps} currentStep={currentStep} />
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
          {currentStep === formSteps.length - 1 ? "Submit" : "Next"}
          <RxChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(FormStepController);
