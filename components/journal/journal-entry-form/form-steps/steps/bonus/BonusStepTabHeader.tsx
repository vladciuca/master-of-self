import { Badge } from "@/components/ui/badge";
import { getStepStyle } from "@components/ui/constants";
import type React from "react";

type BonusStepTabHeaderProps = {
  icon: React.ReactNode;
  count: number;
  stepType: string;
  disciplineScore?: React.ReactNode;
};

export const BonusStepTabHeader = ({
  icon,
  count,
  stepType,
  disciplineScore,
}: BonusStepTabHeaderProps) => {
  const { bgColor } = getStepStyle(stepType);

  return (
    <div className="relative">
      <div className="flex items-center justify-center w-8 h-8">
        {icon}
        {count !== undefined && (
          <Badge
            variant="outline"
            className={`${bgColor} absolute -top-2 -right-4 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
          >
            {count}
          </Badge>
        )}
      </div>

      {/* {disciplineScore && (
        <div className="flex items-center justify-center mt-1">
          {disciplineScore}
        </div>
      )} */}
    </div>
  );
};
