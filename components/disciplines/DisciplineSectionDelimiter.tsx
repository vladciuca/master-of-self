import React from "react";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";

type DisciplineSectionDelimiterProps = {
  day: boolean;
  activeSteps: number;
  maxSteps: number;
};

export function DisciplineSectionDelimiter({
  day,
  activeSteps,
  maxSteps,
}: DisciplineSectionDelimiterProps) {
  const IconElement = day ? stepIconMap.day : stepIconMap.night;
  const iconColor = day ? JOURNAL_COLORS.day : JOURNAL_COLORS.night;

  return (
    <div className="flex items-center justify-between px-2 mt-4 mb-2">
      <div className="flex items-center scroll-m-20 text-md text-muted-foreground font-normal">
        {day ? "Morning" : "Evening"} Steps
      </div>
      <div className="flex items-center space-x-2">
        {React.cloneElement(IconElement as React.ReactElement, {
          size: 20,
          className: `mr-1 text-${iconColor}`,
        })}
        <span className="scroll-m-20 text-lg font-semibold tracking-tight">
          {activeSteps}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{maxSteps}</span>
        </span>
      </div>
    </div>
  );
}
