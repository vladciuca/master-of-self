import { Progress } from "@/components/ui/progress";

interface Step {
  name: string;
}

interface FormStepProgressBarProps {
  steps: Step[];
  currentStep: number;
}

const FormStepProgressBar = ({
  steps,
  currentStep,
}: FormStepProgressBarProps) => {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center w-full mt-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow mx-4">
          <Progress value={progressPercentage} className="w-full h-2" />
        </div>
      </div>
    </div>
  );
};

export default FormStepProgressBar;
