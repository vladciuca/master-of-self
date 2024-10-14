import { Progress } from "@/components/ui/progress";
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

type FormStepProgressProps = {
  availableSteps: Step[];
  currentStepType: string;
  handleStepChange: (stepType: string) => void;
  progressPercentage: any;
};

export function FormStepProgress({
  availableSteps,
  currentStepType,
  handleStepChange,
  progressPercentage,
}: FormStepProgressProps) {
  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex items-center justify-around w-full my-4 px-4">
        {availableSteps.map((step: any, index: any) => {
          const Icon = stepIconMap[step.type] || stepIconMap.default;
          return (
            <span
              key={index}
              className={`text-sm ${
                step.type === currentStepType ? "" : "text-muted-foreground"
              } cursor-pointer`}
              onClick={() => handleStepChange(step.type)}
            >
              <Icon
                size={step.type === currentStepType ? "1.4rem" : "1.3rem"}
              />
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
