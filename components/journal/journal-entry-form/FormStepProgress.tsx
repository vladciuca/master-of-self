import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FaBoltLightning } from "react-icons/fa6";
import { stepIconMap, getStepStyle } from "@components/ui/constants";

type Step = {
  type: string;
  component: React.ReactNode;
  isAvailable: boolean;
};

type FormStepProgressProps = {
  availableSteps: Step[];
  currentStepType: string;
  handleStepChange: (stepType: string) => void;
  progressPercentage: number;
  //Step count
  dayCount: number;
  dailyGoalsCompleted: number;
  gratitudeCount: number;
  affirmationsCount: number;
  highlightsCount: number;
  reflectionCount: number;
  habitActionsCount: number;
};

export function FormStepProgress({
  availableSteps,
  currentStepType,
  handleStepChange,
  progressPercentage,
  //Step counts
  dayCount,
  dailyGoalsCompleted,
  gratitudeCount,
  affirmationsCount,
  highlightsCount,
  reflectionCount,
  habitActionsCount,
}: FormStepProgressProps) {
  const getCount = (stepType: string): number => {
    switch (stepType) {
      case "day":
        return dayCount;
      case "night":
        return dailyGoalsCompleted;
      case "gratitude":
        return gratitudeCount;
      case "affirmations":
        return affirmationsCount;
      case "highlights":
        return highlightsCount;
      case "reflection":
        return reflectionCount;
      case "habits":
        return habitActionsCount;

      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full mt-4 mb-3 px-4 sm:pt-4">
        {availableSteps.map((step: Step, index: number) => {
          const IconElement = stepIconMap[step.type] || stepIconMap.default;
          const { bgColor } = getStepStyle(step.type);
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
