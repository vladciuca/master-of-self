import { Progress } from "@/components/ui/progress";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { GiPrayer, GiBackup } from "react-icons/gi";

type Step = {
  name?: string;
  //add specific strings here
  type: string;
};

type FormStepProgressBarProps = {
  steps: Step[];
  currentStep: number;
  handleStepClick: (
    event: React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => void;
};

const FormStepProgressBar = ({
  steps,
  currentStep,
  handleStepClick,
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
            onClick={(event) => handleStepClick(event, index)}
          >
            {step.type === "day" ? (
              <FaSun size={`${index === currentStep ? "1.4rem" : "1.3rem"}`} />
            ) : step.type === "night" ? (
              <FaMoon size={`${index === currentStep ? "1.4rem" : "1.3rem"}`} />
            ) : step.type === "gratitude" ? (
              <GiPrayer
                size={`${index === currentStep ? "1.4rem" : "1.3rem"}`}
              />
            ) : step.type === "reflection" ? (
              <GiBackup
                size={`${index === currentStep ? "1.4rem" : "1.3rem"}`}
              />
            ) : (
              <FaStar size={`${index === currentStep ? "1.4rem" : "1.3rem"}`} />
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
