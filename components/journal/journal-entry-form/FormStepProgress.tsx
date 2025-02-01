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
  greatTodayCount: number;
  dailyGoalsCompleted: number;
  gratefulForCount: number;
  dailyHighlightsCount: number;
  habitActionsCount: number;
  learnedTodayCount: number;
};

export function FormStepProgress({
  availableSteps,
  currentStepType,
  handleStepChange,
  progressPercentage,
  greatTodayCount,
  dailyGoalsCompleted,
  gratefulForCount,
  dailyHighlightsCount,
  habitActionsCount,
  learnedTodayCount,
}: FormStepProgressProps) {
  const getCount = (stepType: string): number => {
    switch (stepType) {
      case "day":
        return greatTodayCount;
      case "night":
        return dailyGoalsCompleted;
      case "gratitude":
        return gratefulForCount;
      case "highlights":
        return dailyHighlightsCount;
      case "actions":
        return habitActionsCount;
      case "reflection":
        return learnedTodayCount;
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
                } h-10 w-10 rounded-full flex items-center justify-center`}
              >
                {React.cloneElement(IconElement as React.ReactElement)}
              </div>

              {count > 0 && (
                <Badge
                  variant="outline"
                  className={`${bgColor} absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
                >
                  {count}
                </Badge>
              )}
              {step.type === "reward" && (
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
