import React from "react";
import { Badge } from "@/components/ui/badge";
import { getJournalStepStyle, stepIconMap } from "@components/ui/constants";

type BonusStepTabHeaderProps = {
  icon?: React.ReactNode;
  count: number;
  stepType: string;
  stepDiscipline: string;
};

export const BonusStepTabHeader = ({
  icon,
  count,
  stepType,
  stepDiscipline,
}: BonusStepTabHeaderProps) => {
  const { bgColor } = getJournalStepStyle(stepType);

  const IconElement = stepIconMap[stepDiscipline] || stepIconMap.default;

  return (
    <div className="relative">
      <div className="flex items-center justify-center w-8 h-8">
        {React.cloneElement(IconElement as React.ReactElement, {
          size: stepType === "night" ? 25 : 30,
        })}
        {count !== undefined && (
          <Badge
            variant="outline"
            className={`${bgColor} absolute -top-2.5 -right-3 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
          >
            {count}
          </Badge>
        )}
      </div>
    </div>
  );
};
