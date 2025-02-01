import React from "react";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { getStepStyle, stepIconMap } from "@components/ui/constants";

type EntrySectionProps = {
  title: string;
  items?: string[];
  stepType: string;
  contentLoading?: boolean;
  bonusList?: boolean;
};

export function JournalEntrySection({
  title,
  items,
  stepType,
  contentLoading,
  bonusList,
}: EntrySectionProps) {
  const { bgColor } = getStepStyle(stepType);
  const bulletPointPosition = bonusList ? "mt-2" : "mt-[6px]";
  const IconElement = stepIconMap[stepType] || stepIconMap.default;

  return (
    <div>
      <div
        className={`mb-2 flex items-center ${
          bonusList ? "justify-center" : ""
        }`}
      >
        {!bonusList &&
          IconElement &&
          React.cloneElement(IconElement as React.ReactElement, {
            className: "mr-2 text-muted-foreground",
            size: "1rem",
          })}
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>

      {contentLoading ? (
        <SkeletonList />
      ) : (
        <ol className="mx-[3.5px]">
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <li key={index} className="flex items-top">
                <span className="relative">
                  <div
                    className={`rounded-full w-2 h-2 ${bulletPointPosition} ${bgColor}`}
                  />
                </span>
                <span className="ml-2">{item}</span>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}
