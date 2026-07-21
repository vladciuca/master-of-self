import { Button } from "@/components/ui/button";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import type { ReactNode } from "react";

type FormStepNavigationProps = {
  stepsLength: number;
  currentStepIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onCancel: () => void;
  disabled?: boolean;
  nextLabel?: string;
  lastStepAction?: ReactNode;
};

export function FormStepNavigation({
  stepsLength,
  currentStepIndex,
  onPrev,
  onNext,
  onCancel,
  disabled = false,
  nextLabel,
  lastStepAction,
}: FormStepNavigationProps) {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepsLength - 1;

  return (
    <div className="flex justify-around items-center my-4 w-full">
      <Button
        className="w-1/3 rounded-full"
        variant="secondary"
        type="button"
        onClick={isFirstStep ? onCancel : onPrev}
        disabled={disabled}
      >
        <BsCaretLeftFill className="mr-2" />
        {isFirstStep ? "Cancel" : "Back"}
      </Button>

      {isLastStep && lastStepAction ? (
        <div className="flex-1 ml-4">{lastStepAction}</div>
      ) : (
        <Button
          className="w-1/3 rounded-full"
          variant="default"
          type="button"
          onClick={onNext}
          disabled={disabled}
        >
          {isLastStep ? (nextLabel ?? "Complete") : "Next"}
          <BsCaretRightFill className="ml-2" />
        </Button>
      )}
    </div>
  );
}
