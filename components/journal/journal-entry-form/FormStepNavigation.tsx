import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

type FormStepNavigationProps = {
  availableStepsLength: number;
  currentStepIndex: number;
  handlePrevForm: () => void;
  handleNextForm: () => void;
  submitting: boolean;
};

export function FormStepNavigation({
  availableStepsLength,
  currentStepIndex,
  handlePrevForm,
  handleNextForm,
  submitting,
}: FormStepNavigationProps) {
  const router = useRouter();
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === availableStepsLength - 1;

  return (
    <div className="flex justify-around items-center my-4">
      <Button
        className="w-1/3"
        variant={isFirstStep ? "default" : "secondary"}
        type="button"
        onClick={isFirstStep ? () => router.push("/journal") : handlePrevForm}
      >
        <RxChevronLeft />
        {isFirstStep ? "Cancel" : "Back"}
      </Button>

      <Button
        className="w-1/3"
        variant={isLastStep ? "default" : "secondary"}
        type="button"
        onClick={handleNextForm}
        disabled={submitting}
      >
        {isLastStep ? "Complete" : "Next"}
        <RxChevronRight />
      </Button>
    </div>
  );
}
