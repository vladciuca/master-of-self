import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FaSun, FaMoon, FaStar, FaBoltLightning } from "react-icons/fa6";
import {
  GiPrayer,
  GiBackup,
  GiPencilRuler,
  GiEnlightenment,
} from "react-icons/gi";

type StepIconMap = {
  [key: string]: React.ReactNode;
};

const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiBackup size={"1.4rem"} />,
  actions: <GiPencilRuler size={"1.4rem"} />,
  default: <GiEnlightenment size={"1.8rem"} />,
};

type Step = {
  type: string;
  component: React.ReactNode;
  isAvailable: boolean;
};

type CountAndColor = {
  count: number;
  bgColor: string;
  // textColor: string;
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
  learnedTodayCount: number;
  habitActionsCount: number;
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
  learnedTodayCount,
  habitActionsCount,
}: FormStepProgressProps) {
  const getCountAndColor = (stepType: string): CountAndColor => {
    switch (stepType) {
      case "day":
        return {
          count: greatTodayCount,
          bgColor: "bg-yellow-500",
        };
      case "night":
        return {
          count: dailyGoalsCompleted,
          bgColor: "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
        };
      case "gratitude":
        return {
          count: gratefulForCount,
          bgColor: "bg-yellow-500",
        };
      case "reflection":
        return {
          count: learnedTodayCount,
          bgColor: "bg-purple-500",
        };
      case "highlights":
        return {
          count: dailyHighlightsCount,
          bgColor: "bg-purple-500",
        };
      case "actions":
        return {
          count: habitActionsCount,
          bgColor: "bg-pink-500",
        };
      default:
        return {
          count: 0,
          bgColor: "bg-yellow-500",
        };
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full mt-4 mb-3 px-4 sm:pt-4">
        {availableSteps.map((step: Step, index: number) => {
          const IconElement = stepIconMap[step.type] || stepIconMap.default;
          const { count, bgColor } = getCountAndColor(step.type);
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
                } h-10 w-10 rounded-full  flex items-center justify-center`}
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
                  className={`${bgColor} absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center  text-white`}
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
