import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FaBoltLightning } from "react-icons/fa6";
import { getJournalStepStyle } from "@components/ui/constants";
import type { JournalEntryCustomStep } from "@models/types";

type FormStepProgressProps = {
  formSteps: JournalEntryCustomStep[];
  currentStep: string;
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
  currentStep,
  handleStepChange,
  progressPercentage,
  dailyGoals,
  dailyGoalsCompleted,
  habitActionsCount,
  ...countProps
}: FormStepProgressProps) {
  // This function gets the count for a step type from the countProps
  const getCount = (stepDiscipline: string): number => {
    // Special cases first
    if (stepDiscipline === "day" && dailyGoalsCompleted !== undefined) {
      return dailyGoals;
    }

    if (stepDiscipline === "night" && dailyGoalsCompleted !== undefined) {
      return dailyGoalsCompleted;
    }

    if (stepDiscipline === "habits" && habitActionsCount !== undefined) {
      return habitActionsCount;
    }

    // Look for a specific count prop for this step type
    const countProp = `${stepDiscipline}Count` as keyof typeof countProps;

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
        {formSteps.map((step: JournalEntryCustomStep, index: number) => {
          const IconElement = step.icon;

          const discipline =
            step.type === "other" ? step.discipline : step.type;
          const { bgColor } = getJournalStepStyle(discipline);
          const count = getCount(step.discipline);
          return (
            <span
              key={index}
              className={`relative cursor-pointer text-sm ${
                step.discipline === currentStep ? "" : "text-muted-foreground"
              }`}
              onClick={() => handleStepChange(step.discipline)}
            >
              <div
                className={`${
                  step.discipline === currentStep
                    ? "bg-secondary text-primary"
                    : "text-primary"
                } w-11 h-11 rounded-full flex items-center justify-center`}
              >
                {React.cloneElement(IconElement as React.ReactElement, {
                  size:
                    step.discipline === "night" ||
                    step.discipline === "day" ||
                    step.discipline === "bonus"
                      ? 25
                      : step.discipline === "willpower"
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
              {step.discipline === "bonus" && (
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
