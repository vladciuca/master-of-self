import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { IconRenderer } from "@components/IconRenderer";
import { getJournalStepStyle } from "@components/ui/constants";
import { FaBoltLightning } from "react-icons/fa6";
import type { JournalCustomStep } from "@models/types";

type FormStepProgressProps = {
  formSteps: JournalCustomStep[];
  activeStep: string;
  handleStepChange: (stepType: string) => void;
  progressPercentage: number;
  // Instead of requiring specific count props, accept any prop ending with "Count"
  dailyGoals: number;
  dailyGoalsCompleted?: number;
  habitActionsCount: number;
  [key: `${string}Count`]: number;
};

export function FormStepProgress({
  formSteps,
  activeStep,
  handleStepChange,
  progressPercentage,
  dailyGoals,
  dailyGoalsCompleted,
  habitActionsCount,
  ...countProps
}: FormStepProgressProps) {
  // This function gets the count for a step type from the countProps
  const getCount = (stepId: string): number => {
    // Special cases first
    if (stepId === "day" && dailyGoalsCompleted !== undefined) {
      return dailyGoals;
    }

    if (stepId === "night" && dailyGoalsCompleted !== undefined) {
      return dailyGoalsCompleted;
    }

    if (stepId === "habits" && habitActionsCount !== undefined) {
      return habitActionsCount;
    }

    // Look for a specific count prop for this step type
    const countProp = `${stepId}Count` as keyof typeof countProps;

    // If we have a specific count for this step type, use it
    if (countProps[countProp] !== undefined) {
      return countProps[countProp];
    }

    // Default to 0 if no count is found
    return 0;
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full mt-4 mb-3 px-4 sm:pt-4">
        {formSteps.map((step: JournalCustomStep, index: number) => {
          // console.log("===================color?", step.color);
          const stepId = step._id;
          const discipline =
            step.type === "other" ? step.discipline : step.type;
          const { bgColor } = getJournalStepStyle(discipline);
          const count = getCount(String(stepId));
          return (
            <span
              key={index}
              className={`relative cursor-pointer text-sm ${
                stepId === activeStep ? "" : "text-muted-foreground"
              }`}
              onClick={() => handleStepChange(String(stepId))}
            >
              <div
                className={`${
                  stepId === activeStep
                    ? "bg-secondary text-primary"
                    : "text-primary"
                } w-11 h-11 rounded-full flex items-center justify-center`}
              >
                <IconRenderer
                  iconName={step.icon}
                  size={
                    stepId === "night" ||
                    stepId === "day" ||
                    stepId === "bonus" ||
                    stepId === "habits"
                      ? 25
                      : stepId === "willpower"
                      ? 23
                      : 30
                  }
                  className={step.color ? `text-${step.color}` : ""}
                />
              </div>

              {count > 0 && (
                <Badge
                  variant="outline"
                  className={`${bgColor} absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
                >
                  {count}
                </Badge>
              )}
              {stepId === "bonus" && (
                <Badge
                  variant="outline"
                  className={`${bgColor} absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
                >
                  <FaBoltLightning />
                </Badge>
              )}
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
