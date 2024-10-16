import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideProps } from "lucide-react";
import { IconType } from "react-icons";
import { FaSun, FaMoon, FaStar } from "react-icons/fa6";
import { GiPrayer, GiBackup, GiPencilRuler } from "react-icons/gi";

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
  habits: GiPencilRuler,
  default: FaStar,
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
  gratefulForCount: number;
  dailyHighlightsCount: number;
  habitActionsCount: number;
};

export function FormStepProgress({
  availableSteps,
  currentStepType,
  handleStepChange,
  progressPercentage,
  greatTodayCount,
  gratefulForCount,
  dailyHighlightsCount,
  habitActionsCount,
}: FormStepProgressProps) {
  // const getCount = (stepType: string) => {
  //   switch (stepType) {
  //     case "day":
  //       return greatTodayCount;
  //     case "gratitude":
  //       return gratefulForCount;
  //     case "night":
  //       return dailyHighlightsCount;
  //     case "habits":
  //       return habitActionsCount;
  //     default:
  //       return 0;
  //   }
  // };

  const getCountAndColor = (stepType: string): CountAndColor => {
    switch (stepType) {
      case "day":
        return {
          count: greatTodayCount,
          bgColor: "bg-purple-500",
          // textColor: "text-yellow-900",
        };
      case "gratitude":
        return {
          count: gratefulForCount,
          bgColor: "bg-purple-500",
          // textColor: "text-green-900",
        };
      case "night":
        return {
          count: dailyHighlightsCount,
          bgColor: "bg-green-500",
          // textColor: "text-blue-900",
        };
      case "habits":
        return {
          count: habitActionsCount,
          bgColor: "bg-blue-500",
          // textColor: "text-purple-900",
        };
      default:
        return {
          count: 0,
          bgColor: "bg-gray-500",
          // textColor: "text-gray-900"
        };
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full my-4 px-4 pt-2">
        {availableSteps.map((step: any, index: any) => {
          const Icon = stepIconMap[step.type] || stepIconMap.default;
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
                <Icon
                  size={step.type === currentStepType ? "1.4rem" : "1.3rem"}
                />
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
