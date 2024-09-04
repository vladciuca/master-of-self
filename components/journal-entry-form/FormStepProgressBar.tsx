import { Progress } from "@/components/ui/progress";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { GiPrayer, GiBackup } from "react-icons/gi";

interface Step {
  name?: string;
  type: string;
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
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-around w-full my-4 px-4">
        {steps.map((step: Step, index: number) => (
          <span
            key={index}
            className={`text-sm ${
              index === currentStep ? "" : "text-muted-foreground"
            }`}
          >
            {step.type === "day" ? (
              <FaSun size={`${index === currentStep ? "1.4rem" : "1.1rem"}`} />
            ) : step.type === "night" ? (
              <FaMoon size={`${index === currentStep ? "1.4rem" : "1.1rem"}`} />
            ) : step.type === "gratitude" ? (
              <GiPrayer
                size={`${index === currentStep ? "1.4rem" : "1.1rem"}`}
              />
            ) : step.type === "reflection" ? (
              <GiBackup
                size={`${index === currentStep ? "1.4rem" : "1.1rem"}`}
              />
            ) : (
              <FaStar size={`${index === currentStep ? "1.4rem" : "1.1rem"}`} />
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow mx-4">
          <Progress value={progressPercentage} className="w-full h-2" />
        </div>
      </div>
    </div>
  );
};

export default FormStepProgressBar;
