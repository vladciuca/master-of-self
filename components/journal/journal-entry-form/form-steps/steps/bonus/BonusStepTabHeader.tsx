import type React from "react";
import { Badge } from "@/components/ui/badge";
import { IconRenderer } from "@components/IconRenderer";
import { getJournalStepStyle, stepIconMap } from "@components/ui/constants";

type BonusStepTabHeaderProps = {
  icon?: React.ReactNode;
  count: number;
  stepType: string;
  stepDiscipline: string;
  disciplineIcon?: string;
  disciplineColor?: string;
};

export const BonusStepTabHeader = ({
  icon,
  count,
  stepType,
  stepDiscipline,
  disciplineIcon,
  disciplineColor,
}: BonusStepTabHeaderProps) => {
  const { bgColor } = getJournalStepStyle(stepType);

  // Determine which icon to use - prioritize disciplineIcon, then stepIconMap, then default
  const iconToRender =
    disciplineIcon || stepIconMap[stepDiscipline] || stepIconMap.default;

  return (
    <div className="relative">
      <div className="flex items-center justify-center w-8 h-8">
        <IconRenderer
          iconName={iconToRender}
          size={stepType === "night" ? 25 : 30}
          className={`${disciplineColor ? `text-${disciplineColor}` : ""}`}
        />
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
