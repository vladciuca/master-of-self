import React from "react";
import { JournalEntrySection } from "@/components/journal/journal-entry-card/JournalEntrySection";
import {
  stepPoints,
  stepIconMap,
  getStepStyle,
} from "@components/ui/constants";
import { calculateStepScore } from "@lib/score";
import { FaCircle } from "react-icons/fa";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type JournalEntryDisciplineProps = {
  dayEntry: JournalDayEntry;
  nightEntry: JournalNightEntry;
};

//NOTE: rename this to JournalEntries to correlate with JournalEntrySection children
export function JournalEntryDiscipline({
  dayEntry,
  nightEntry,
}: JournalEntryDisciplineProps) {
  const scoreData = [
    {
      stepType: "gratitude",
      score: calculateStepScore(dayEntry?.gratefulFor || []),
      data: dayEntry?.gratefulFor || [],
      title: "What I am grateful for today...",
    },
    {
      stepType: "day",
      score: calculateStepScore(dayEntry?.greatToday || []),
      data: dayEntry?.greatToday || [],
      title: "What will make today great...",
    },
    {
      stepType: "highlights",
      score: calculateStepScore(nightEntry?.dailyHighlights || []),
      data: nightEntry?.dailyHighlights || [],
      title: "Today's highlights...",
    },
    {
      stepType: "reflection",
      score: calculateStepScore(nightEntry?.learnedToday || []),
      data: nightEntry?.learnedToday || [],
      title: "What have I learned today...",
    },
  ];

  return (
    <Accordion type="single" collapsible className="grid grid-cols-1 gap-3 p-0">
      {scoreData.map(({ stepType, score, data, title }) => {
        if (!data || data.length === 0) return null;

        const pointType = stepPoints[stepType] || "Default";
        const IconElement = stepIconMap[stepType] || stepIconMap.default;
        const { bgColor } = getStepStyle(stepType);
        const circleColor = bgColor.replace("bg-", "text-");

        const circles = Array.from({ length: data.length }).map((_, index) => (
          <FaCircle
            key={index}
            className={`${circleColor} ${
              index > 0 ? "ml-0.5" : ""
            } text-[0.5rem]`}
          />
        ));

        return (
          <AccordionItem
            key={stepType}
            value={stepType}
            className="border rounded-lg overflow-hidden py-0 pl-2 pr-4 mb-0"
          >
            <AccordionTrigger className="hover:no-underline py-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-primary bg-muted rounded-full p-2">
                    {React.cloneElement(IconElement as React.ReactElement, {
                      className: "text-lg",
                      size: "1.5rem",
                    })}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      {pointType}
                    </span>
                    <div className="flex items-center mt-1 flex-wrap max-w-[200px]">
                      {circles}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-green-500">
                    +{score}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-0 px-1">
              <JournalEntrySection
                title={title}
                items={data}
                stepType={stepType}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
