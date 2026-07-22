import { Progress } from "@/components/ui/progress";

export type OnboardingStepMeta = {
  id: number;
  title: string;
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
        <div className="w-full space-y-3">
          <div className="flex justify-around items-center">
            {steps.map((step, index) => {
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-secondary text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
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
