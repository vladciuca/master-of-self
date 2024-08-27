import React from "react";
import { Progress } from "@/components/ui/progress";
import { Title } from "@components/ui/tipography";

interface Step {
  name: string;
}

interface FormStepProgressBarProps {
  steps: Step[];
  currentStep: number;
  prev: () => void;
  next: () => void;
}

const FormStepProgressBar = ({
  steps,
  currentStep,
}: FormStepProgressBarProps) => {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center w-full mt-4">
      <div className="text-center mb-4">
        <Title text={steps[currentStep].name} />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex-grow mx-4">
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </div>
      {/* <div className="flex justify-between w-full mt-2">
        {steps.map((step: Step, index: number) => (
          <span
            key={index}
            className={`text-sm ${index === currentStep ? "font-bold" : ""}`}
          >
            {step.name}
          </span>
        ))}
      </div> */}
    </div>
  );
};

export default FormStepProgressBar;
