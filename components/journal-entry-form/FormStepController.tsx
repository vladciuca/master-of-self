import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormStepProgressBar from "./FormStepProgressBar";
import GreatToday from "./form-steps/GreatToday";
import DailyHighlights from "./form-steps/DailyHighlights";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { FaBoltLightning } from "react-icons/fa6";

const formSteps = [
  { name: "What will make today great?" },
  { name: "What are your highlights of the day?" },
];

interface JournalEntry {
  dailyWillpower: number;
  dayEntry?: { greatToday: string };
  nightEntry?: { dailyHighlights: string };
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
      dayEntry: { greatToday: "" },
      nightEntry: { dailyHighlights: "" },
    }
  );
  const router = useRouter();

  useEffect(() => {
    if (journalEntryData) {
      setFormData(journalEntryData);
    }
  }, [journalEntryData]);

  const calculateWillpower = (dayLength: number, nightLength: number) => {
    return Math.floor((dayLength + nightLength) / 10);
  };

  const handleChange = (
    field: "dayEntry" | "nightEntry",
    value: { greatToday: string } | { dailyHighlights: string }
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      const dayLength = newData.dayEntry?.greatToday.length || 0;
      const nightLength = newData.nightEntry?.dailyHighlights.length || 0;
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
          <GreatToday
            dayEntry={formData.dayEntry?.greatToday || ""}
            onChange={handleChange}
          />
        )}
        {currentStep === 1 && (
          <DailyHighlights
            nightEntry={formData.nightEntry?.dailyHighlights || ""}
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
