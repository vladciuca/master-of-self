import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

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
        <BsCaretLeftFill className="mr-2"/>
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
        <BsCaretRightFill className="ml-2" />
      </Button>
    </div>
  );
}
