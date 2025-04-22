import React, { useEffect, useRef } from "react";
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
  // Create a ref for the container div
  const containerRef = useRef<HTMLDivElement>(null);
  // Create refs for each step icon
  const stepRefs = useRef<Record<string, HTMLSpanElement | null>>({});

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

  // Effect to scroll the active step into view when it changes
  useEffect(() => {
    if (activeStep && stepRefs.current[activeStep]) {
      const activeStepElement = stepRefs.current[activeStep];
      const container = containerRef.current;

      if (activeStepElement && container) {
        // Calculate positions
        const containerRect = container.getBoundingClientRect();
        const stepRect = activeStepElement.getBoundingClientRect();

        // Check if the step is not fully visible
        const isStepLeftOfView = stepRect.left < containerRect.left;
        const isStepRightOfView = stepRect.right > containerRect.right;

        if (isStepLeftOfView) {
          // If step is to the left of the visible area, scroll to make it visible
          container.scrollLeft += stepRect.left - containerRect.left - 20; // Add some padding
        } else if (isStepRightOfView) {
          // If step is to the right of the visible area, scroll to make it visible
          container.scrollLeft += stepRect.right - containerRect.right + 20; // Add some padding
        }
      }
    }
  }, [activeStep]);

  return (
    <>
      <div className="w-full">
        <div className="px-4 sm:pt-4">
          <div className="overflow-x-auto" ref={containerRef}>
            <div className="flex items-center mt-4 mb-3 min-w-max">
              {formSteps.map((step: JournalCustomStep, index: number) => {
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
                    ref={(el) => {
                      stepRefs.current[String(stepId)] = el;
                    }}
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
          </div>
        </div>
      </div>

      <div className="mb-4 mx-4">
        <Progress value={progressPercentage} className="w-full h-2" />
      </div>
    </>
  );
}
