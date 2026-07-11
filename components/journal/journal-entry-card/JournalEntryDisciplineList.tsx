import React from "react";
import { FaRedoAlt } from "react-icons/fa";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { getJournalStepStyle } from "@components/ui/constants";

type JournalEntryDisciplineListProps = {
  title?: string;
  items?: string[];
  stepType: string;
  contentLoading?: boolean;
  bonusList?: boolean;
  carryOver?: string[];
};

export function JournalEntryDisciplineList({
  title,
  items,
  stepType,
  contentLoading,
  bonusList,
  carryOver = [],
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
                    <span
                      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-black mr-1 align-middle"
                      aria-label="Carry over to tomorrow"
                      title="Carry over to tomorrow"
                    >
                      <FaRedoAlt className="h-3 w-3" />
                    </span>
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
