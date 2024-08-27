import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import DayForm from "./form-steps/DayFrom";
import NightForm from "./form-steps/NightForm";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { FaBoltLightning } from "react-icons/fa6";

const formSteps = [{ name: "Day entry" }, { name: "Night entry" }];

interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: { myDay: string };
  nightEntry?: { myNight: string };
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
      dayEntry: { myDay: "" },
      nightEntry: { myNight: "" },
    }
  );
  const router = useRouter();

  useEffect(() => {
    if (journalEntryData) {
      setFormData(journalEntryData);
    }
  }, [journalEntryData]);

  const calculateWillpower = (dayLength: number, nightLength: number) => {
    // You can adjust this calculation as needed
    return Math.floor((dayLength + nightLength) / 10);
  };

  const handleChange = (
    field: "dayEntry" | "nightEntry",
    value: { myDay: string } | { myNight: string }
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      const dayLength = newData.dayEntry?.myDay.length || 0;
      const nightLength = newData.nightEntry?.myNight.length || 0;
      const newWillpower = calculateWillpower(dayLength, nightLength);
      return { ...newData, dailyWillpower: newWillpower };
    });
  };

  const next = async () => {
    if (currentStep < formSteps.length - 1) {
      // Submit the current step data
      await onSubmit(formData);
      setCurrentStep((step) => step + 1);
    } else {
      // Final submission
      await onSubmit(formData);
      router.push("/journal");
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

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

      <div className="overflow-y-auto">
        {currentStep === 0 && (
          <DayForm
            dayEntry={formData.dayEntry?.myDay || ""}
            onChange={handleChange}
          />
        )}
        {currentStep === 1 && (
          <NightForm
            nightEntry={formData.nightEntry?.myNight || ""}
            onChange={handleChange}
          />
        )}
      </div>

      <div className="flex justify-around items-center mb-4">
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

export default FormStepController;
