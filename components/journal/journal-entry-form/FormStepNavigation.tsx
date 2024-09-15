import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";
import { JournalEntry } from "@app/types/types";

type FormStepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  onSubmit: (formData: JournalEntry) => Promise<void>;
  formData: JournalEntry;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
};

export function FormStepNavigation({
  currentStep,
  totalSteps,
  onSubmit,
  formData,
  setCurrentStep,
  isSubmitting,
}: FormStepNavigationProps) {
  const router = useRouter();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handleCloseForm = useCallback(() => {
    router.push("/journal");
  }, [router]);

  const handleNextForm = useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      await onSubmit(formData);
      setCurrentStep((step) => step + 1);
    } else {
      await onSubmit(formData);
      handleCloseForm();
    }
  }, [
    currentStep,
    totalSteps,
    formData,
    onSubmit,
    setCurrentStep,
    handleCloseForm,
  ]);

  const handlePrevForm = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  }, [currentStep, setCurrentStep]);

  return (
    <div className="flex justify-around items-center my-4">
      <Button
        className="w-1/3"
        variant={isFirstStep ? "secondary" : "default"}
        type="button"
        onClick={isFirstStep ? handleCloseForm : handlePrevForm}
      >
        <RxChevronLeft />
        {isFirstStep ? "Cancel" : "Back"}
      </Button>

      <Button
        className="w-1/3"
        variant={isLastStep ? "secondary" : "default"}
        type="button"
        onClick={handleNextForm}
        disabled={isSubmitting}
      >
        {isLastStep ? "Complete" : "Next"}
        <RxChevronRight />
      </Button>
    </div>
  );
}
