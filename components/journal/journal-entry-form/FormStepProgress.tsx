import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// import { LucideProps } from "lucide-react";
// import { IconType } from "react-icons";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import {
  GiPrayer,
  GiBackup,
  GiPencilRuler,
  GiEnlightenment,
} from "react-icons/gi";

// type StepIconMap = {
//   [key: string]:
//     | IconType
//     | React.ForwardRefExoticComponent<
//         Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
//       >;
// };

type StepIconMap = {
  [key: string]: React.ReactNode;
};

// const stepIconMap: StepIconMap = {
//   day: FaSun,
//   night: FaMoon,
//   highlights: FaStar,
//   gratitude: GiPrayer,
//   reflection: GiBackup,
//   habits: GiPencilRuler,
//   default: GiEnlightenment,
// };

const stepIconMap: StepIconMap = {
  day: <FaSun size={"1.3rem"} />,
  night: <FaMoon size={"1.4rem"} />,
  highlights: <FaStar size={"1.4rem"} />,
  gratitude: <GiPrayer size={"1.4rem"} />,
  reflection: <GiBackup size={"1.4rem"} />,
  habits: <GiPencilRuler size={"1.3rem"} />,
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
  dailyGoalsToHighlights: number;
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
  dailyGoalsToHighlights,
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
          count: dailyGoalsToHighlights,
          bgColor: "bg-pink-500",
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
      case "habits":
        return {
          count: habitActionsCount,
          bgColor: "bg-green-500",
        };
      default:
        return {
          count: 0,
          bgColor: "bg-gray-500",
        };
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full mt-4 mb-3 px-4 sm:pt-4">
        {availableSteps.map((step: Step, index: number) => {
          // const Icon = stepIconMap[step.type] || stepIconMap.default;
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
                {/* <Icon
                  size={step.type === currentStepType ? "1.4rem" : "1.3rem"}
                /> */}
                {React.cloneElement(
                  IconElement as React.ReactElement
                  // {
                  //   size: step.type === currentStepType ? "1.4rem" : "1.3rem",
                  // }
                )}
              </div>

              {count > 0 && (
                <Badge
                  variant="outline"
                  className={`${bgColor} opacity-75 absolute -top-1 -right-1 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center`}
                >
                  {count}
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
