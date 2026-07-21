import { Progress } from "@/components/ui/progress";
import { IconRenderer } from "@components/IconRenderer";
import { Check } from "lucide-react";

export type OnboardingStepMeta = {
  id: number;
  title: string;
  icon: string;
};

type OnboardingStepperProps = {
  steps: OnboardingStepMeta[];
  currentStep: number;
  progress: number;
  onStepSelect: (stepId: number) => void;
};

export function OnboardingStepper({
  steps,
  currentStep,
  progress,
  onStepSelect,
}: OnboardingStepperProps) {
  return (
    <div className="flex-shrink-0 bg-card min-h-20 py-2 sm:mt-1 sm:mb-2">
      <div className="px-4 h-full flex items-center">
        <div className="w-full space-y-2">
          <div className="flex justify-around items-center">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  className="relative"
                  aria-label={`Go to step ${step.id}: ${step.title}`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <IconRenderer iconName={step.icon} size={25} />
                  </div>
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 bg-green-500 rounded-full min-w-[1.2rem] h-[1.2rem] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
}
