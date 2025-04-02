import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FaBoltLightning } from "react-icons/fa6";
import {
  stepIconMap,
  getStepStyle,
  getJournalStepStyle,
} from "@components/ui/constants";

// Update the Step type to be more flexible
type Step = {
  type: string;
  component: React.ReactNode;
  isAvailable: boolean;
  category?: "day" | "night" | "other";
  icon?: React.ReactNode;
};

type FormStepProgressProps = {
  formSteps: Step[];
  currentStepType: string;
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
  currentStepType,
  handleStepChange,
  progressPercentage,
  dailyGoals,
  dailyGoalsCompleted,
  habitActionsCount,
  ...countProps
}: FormStepProgressProps) {
  console.log("========countProps", countProps);
  // This function gets the count for a step type from the countProps
  const getCount = (stepType: string): number => {
    // Special cases first
    if (stepType === "day" && dailyGoalsCompleted !== undefined) {
      return dailyGoals;
    }

    if (stepType === "night" && dailyGoalsCompleted !== undefined) {
      return dailyGoalsCompleted;
    }

    if (stepType === "habits" && habitActionsCount !== undefined) {
      return habitActionsCount;
    }

    // Look for a specific count prop for this step type
    const countProp = `${stepType}Count` as keyof typeof countProps;

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
        {formSteps.map((step: Step, index: number) => {
          // console.log("========step_cat", step.category);
          // console.log("========step_type", step.type);

          const IconElement = step.icon;
          const { bgColor } = getJournalStepStyle(
            step.category === "other"
              ? step.type
              : step.category === "day"
              ? "dayEntry"
              : "nightEntry"
          );
          const count = getCount(step.type);
          return (
            <span
              key={index}
              className={`relative cursor-pointer text-sm ${
                step.type === currentStepType ? "" : "text-muted-foreground"
              }`}
              onClick={() => handleStepChange(step.type)}
            >
              <div
                className={`${
                  step.type === currentStepType
                    ? "bg-secondary text-primary"
                    : "text-primary"
                } w-11 h-11 rounded-full flex items-center justify-center`}
              >
                {React.cloneElement(IconElement as React.ReactElement, {
                  size:
                    step.type === "night" || step.type === "day"
                      ? 25
                      : step.type === "willpower"
                      ? 23
                      : 30,
                })}
              </div>

              {count > 0 && (
                <Badge
                  variant="outline"
                  className={`${bgColor} absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
                >
                  {count}
                </Badge>
              )}
              {step.type === "bonus" && (
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
