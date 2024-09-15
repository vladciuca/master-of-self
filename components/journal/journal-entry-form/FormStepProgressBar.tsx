import React from "react";
import { Progress } from "@/components/ui/progress";
import { Shell } from "lucide-react";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { GiPrayer, GiBackup } from "react-icons/gi";
import { IconType } from "react-icons";
import { LucideProps } from "lucide-react";

type Step = {
  type: string;
};

type FormStepProgressBarProps = {
  steps: Step[];
  currentStep: number;
  onStepChange: (index: number) => void;
};

type StepIconMap = {
  [key: string]:
    | IconType
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
};

const stepIconMap: StepIconMap = {
  day: FaSun,
  night: FaMoon,
  gratitude: GiPrayer,
  reflection: GiBackup,
  habits: Shell,
  default: FaStar,
};

export function FormStepProgressBar({
  steps,
  currentStep,
  onStepChange,
}: FormStepProgressBarProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const getStepIcon = (type: string) => {
    return stepIconMap[type] || stepIconMap.default;
  };

  const handleStepClick = (index: number) => {
    onStepChange(index);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-around w-full my-4 px-4">
        {steps.map((step: Step, index: number) => {
          const Icon = getStepIcon(step.type);
          return (
            <span
              key={index}
              className={`text-sm ${
                index === currentStep ? "" : "text-muted-foreground"
              } cursor-pointer`}
              onClick={() => handleStepClick(index)}
            >
              <Icon size={index === currentStep ? "1.4rem" : "1.3rem"} />
            </span>
          );
        })}
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow mx-4">
          <Progress value={progressPercentage} className="w-full h-2" />
        </div>
      </div>
    </div>
  );
}
