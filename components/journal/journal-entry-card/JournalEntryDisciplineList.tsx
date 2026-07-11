import React from "react";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { Badge } from "@components/ui/badge";
import { getJournalStepStyle } from "@components/ui/constants";

type JournalEntryDisciplineListProps = {
  title?: string;
  items?: string[];
  stepType: string;
  contentLoading?: boolean;
  bonusList?: boolean;
  carryOver?: string[];
  repeat?: string[];
};

export function JournalEntryDisciplineList({
  title,
  items,
  stepType,
  contentLoading,
  bonusList,
  carryOver = [],
  repeat = [],
}: JournalEntryDisciplineListProps) {
  const { bgColor } = getJournalStepStyle(stepType);
  const bulletPointPosition = bonusList ? "mt-2" : "mt-[6px]";

  return (
    <div>
      {title && (
        <div className="my-1 flex items-center">
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      )}

      {contentLoading ? (
        <SkeletonList />
      ) : (
        <ol className="mr-[3.5px]">
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <li key={index} className="flex items-top">
                <span className="relative">
                  <div
                    className={`rounded-full w-2 h-2 ${bulletPointPosition} ${bgColor}`}
                  />
                </span>
                <span className="ml-2 break-words">
                  {carryOver.includes(item) && (
                    <Badge variant="secondary" className="mr-1 align-middle">
                      Carry Over
                    </Badge>
                  )}
                  {repeat.includes(item) && (
                    <Badge variant="secondary" className="mr-1 align-middle">
                      Repeat
                    </Badge>
                  )}
                  {item}
                </span>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
}
