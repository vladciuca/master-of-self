import React from "react";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { getStepStyle } from "@components/ui/constants";

type JournalEntryDisciplineListProps = {
  title: string;
  items?: string[];
  stepType: string;
  contentLoading?: boolean;
  bonusList?: boolean;
};

export function JournalEntryDisciplineList({
  title,
  items,
  stepType,
  contentLoading,
  bonusList,
}: JournalEntryDisciplineListProps) {
  const { bgColor } = getStepStyle(stepType);
  const bulletPointPosition = bonusList ? "mt-2" : "mt-[6px]";

  return (
    <div>
      <div
        className={`my-2 flex items-center ${
          bonusList ? "justify-center" : ""
        }`}
      >
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>

      {contentLoading ? (
        <SkeletonList />
      ) : (
        <ol className={`mx-[3.5px] ${bonusList ? "mt-4" : ""}`}>
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
