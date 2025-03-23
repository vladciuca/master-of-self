import { Badge } from "@/components/ui/badge";
// import { FaBoltLightning } from "react-icons/fa6";
import { getStepStyle } from "@components/ui/constants";
// import { JOURNAL_COLORS } from "@lib/colors";
import type React from "react";

type BonusStepTabHeaderProps = {
  icon: React.ReactNode;
  count: number;
  stepType: string;
  // bonusWillpowerValue: number;
  disciplineScore: React.ReactNode;
};

export const BonusStepTabHeader = ({
  icon,
  count,
  stepType,
  // bonusWillpowerValue,
  disciplineScore,
}: BonusStepTabHeaderProps) => {
  const { bgColor } = getStepStyle(stepType);
  return (
    <div>
      <div className="relative flex items-center justify-center">
        {icon}
        <Badge
          variant="outline"
          className={`${bgColor} absolute -top-4 -right-6 text-[0.6rem] px-1 py-0 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-white`}
        >
          {count}
        </Badge>
      </div>

      <div className="flex items-center justify-center mt-2">
        {disciplineScore}
        {/* <FaBoltLightning className="ml-1" /> */}
      </div>
    </div>
  );
};
