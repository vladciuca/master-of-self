import React from "react";
import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";

type DisciplineFeedHeaderProps = {
  icon?: string;
  color?: string;
  discipline: string;
  title: string;
  type?: string;
};

export function DisciplineFeedHeader({
  icon,
  color,
  discipline,
  title,
  type,
}: DisciplineFeedHeaderProps) {
  return (
    <div className="flex flex-row w-full pl-2">
      {/* Icon section */}
      {icon && (
        <div className="w-2/12 flex items-center justify-center mb-0">
          <IconRenderer iconName={icon} className={`text-${color}`} size={40} />
        </div>
      )}

      {/* Content section */}
      <div className="flex flex-col items-start w-full px-3">
        <span>{discipline}</span>
        <span
          className={`scroll-m-20 text-lg font-semibold tracking-tight text-${color}`}
        >
          {title}
        </span>
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="w-2/12 flex items-center justify-center mt-0">
          {type === "dayEntry" ? (
            <IconRenderer
              iconName={stepIconMap.day}
              //   className={`text-${JOURNAL_COLORS.day}`}
              className="text-muted"
            />
          ) : (
            <IconRenderer
              iconName={stepIconMap.night}
              //   className={`text-${JOURNAL_COLORS.night}`}
              className="text-muted"
            />
          )}
        </div>
      )}
    </div>
  );
}
