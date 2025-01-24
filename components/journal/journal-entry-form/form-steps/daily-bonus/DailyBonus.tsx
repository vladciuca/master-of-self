import React, { useRef } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
// import { JournalEntryHabits } from "@components/journal/JournalEntryHabits";
// import { HabitsUsed } from "./HabitsUsed";
import { Label } from "@components/ui/label";
import { SkeletonList } from "@components/skeletons/SkeletonList";
import { FaBoltLightning } from "react-icons/fa6";
import { BsChevronCompactDown } from "react-icons/bs";
import { GiDeadlyStrike } from "react-icons/gi";
import { useYesterdayJournalEntry } from "@hooks/useYesterdayJournalEntry";
// import { calculateHabitsXpSumsFromActions } from "@lib/level";

type DailyBonusProps = {
  bonusWillpower: number;
};

export function DailyBonus({ bonusWillpower }: DailyBonusProps) {
  const {
    yesterdayEntry,
    yesterdayHighlights = [],
    yesterdayEntryLoading,
  } = useYesterdayJournalEntry();
  const highlightsRef = useRef<HTMLDivElement>(null);

  const scrollToHighlights = () => {
    highlightsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // const habitsXpFromActions = yesterdayEntry?.nightEntry?.actions
  //   ? calculateHabitsXpSumsFromActions(
  //       yesterdayEntry.nightEntry.actions,
  //       yesterdayEntry.dailyWillpower
  //     )
  //   : {};

  return (
    <FormStepTemplate title="Yesterday's rewards">
      <div className="h-full overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-around min-h-full">
            <div className="flex flex-col items-center">
              <GiDeadlyStrike size={140} />
              <div className="text-4xl my-4 flex items-center">
                <span className="text-green-500 font-semibold">
                  +{bonusWillpower}
                </span>
                <FaBoltLightning className="ml-2 text-3xl" />
              </div>
              <div className="text-muted-foreground text-center">
                Empowered from yesterday's highlights!
              </div>
              {/* Habits Used Yesterday */}
              {/* <div className="flex-grow flex flex-col items-start">
                {yesterdayEntry?.nightEntry?.actions &&
                  Object.keys(yesterdayEntry.nightEntry.actions).length > 0 && (
                    <div className="mt-2 flex w-full">
                      <div className="flex-grow flex flex-wrap items-start">
                        <HabitsUsed habitsXp={habitsXpFromActions} />
                      </div>
                    </div>
                  )}
              </div> */}
            </div>

            <div className="h-[20%] flex items-center justify-center">
              <BsChevronCompactDown
                className="text-muted-foreground cursor-pointer"
                size={48}
                onClick={scrollToHighlights}
              />
            </div>
          </div>

          <div ref={highlightsRef} className="flex-1 min-h-full">
            <Label className="h-[15%] w-full text-center">
              <div className="leading-relaxed text-muted-foreground mx-4 mb-6">
                {"Yesterday's highlights!"}
              </div>
            </Label>
            <div className="h-[85%] overflow-y-scroll">
              {yesterdayEntryLoading && yesterdayHighlights.length > 0 ? (
                <SkeletonList />
              ) : (
                <ol className="list-decimal pl-8 mx-1">
                  {yesterdayHighlights.map((highlight, index) => (
                    <li key={index} className="mb-2">
                      {highlight}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormStepTemplate>
  );
}
