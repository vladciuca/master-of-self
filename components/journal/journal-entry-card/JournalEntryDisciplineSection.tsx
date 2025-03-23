import React from "react";
import { JournalEntryDisciplineList } from "@components/journal/journal-entry-card/JournalEntryDisciplineList";
import {
  stepDisciplines,
  stepIconMap,
  getStepStyle,
  stepStyles,
} from "@components/ui/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Plus } from "lucide-react";
import { calculateStepScore } from "@lib/score";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";

type JournalEntryDisciplineSectionProps = {
  dayEntry: JournalDayEntry;
  nightEntry: JournalNightEntry;
};

// Define a type for the score data items
type ScoreDataItem = {
  stepType: string;
  score: number;
  data: string[];
  title: string;
  completedCount?: number; // Make this optional
  renderSections?: () => React.ReactNode;
};

export function JournalEntryDisciplineSection({
  dayEntry,
  nightEntry,
}: JournalEntryDisciplineSectionProps) {
  // Functions to handle completed and uncompleted to-dos
  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const completedToDos = nightEntry?.howGreatToday || [];

    return completedToDos.filter((item) => dailyToDos.includes(item));
  };

  const uncompletedDailyToDos = () => {
    const dailyToDos = dayEntry?.greatToday || [];
    const completedToDos = new Set(nightEntry?.howGreatToday);

    return dailyToDos.filter((item) => !completedToDos.has(item));
  };

  const completed = completedDailyToDos();
  const uncompleted = uncompletedDailyToDos();
  const allTodos = [...uncompleted, ...completed];
  const completedCount = completed.length;

  // Create base score data with proper typing
  const baseScoreData: ScoreDataItem[] = [
    {
      stepType: "gratitude",
      score: calculateStepScore(dayEntry?.gratefulFor || []),
      data: dayEntry?.gratefulFor || [],
      title: "What I am grateful for today...",
    },
    {
      stepType: "day",
      score: calculateStepScore(allTodos),
      data: allTodos,
      completedCount: completedCount,
      title: "Daily Goals",
      renderSections: () => (
        <>
          {uncompleted.length > 0 && (
            <JournalEntryDisciplineList
              title="What will make today great..."
              items={uncompleted}
              stepType="day"
            />
          )}
          {completed.length > 0 && (
            <JournalEntryDisciplineList
              title="What made today great..."
              items={completed}
              stepType="night"
            />
          )}
        </>
      ),
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
      {baseScoreData.map((item) => {
        const { stepType, score, data, title, completedCount, renderSections } =
          item;

        if (!data || data.length === 0) return null;

        const pointType = stepDisciplines[stepType] || "Default";

        // Determine which icon to use - use night icon for day step if there are completed todos
        let IconElement;
        if (
          stepType === "day" &&
          typeof completedCount === "number" &&
          completedCount > 0
        ) {
          IconElement = stepIconMap["night"]; // Use night icon when there are completed todos
        } else {
          IconElement = stepIconMap[stepType] || stepIconMap.default;
        }

        const { bgColor } = getStepStyle(stepType);

        // Get day and night colors directly from stepStyles
        const dayBgColor = stepStyles.day.bgColor;
        const nightBgColor = stepStyles.night.bgColor;

        // Create circles with different colors based on completion status
        const circles = Array.from({ length: data.length }).map((_, index) => {
          // For the day stepType, use different colors for completed vs uncompleted
          let circleBgColor = bgColor;

          if (stepType === "day" && typeof completedCount === "number") {
            // If this is a completed circle (index >= uncompleted count)
            circleBgColor =
              index >= data.length - completedCount ? nightBgColor : dayBgColor;
          }

          return (
            <div
              key={index}
              className={`${circleBgColor} w-2 h-2 rounded-full ${
                index > 0 ? "ml-0.5" : ""
              }`}
            />
          );
        });

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
                      size: "1.2rem",
                    })}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-muted-foreground">
                      {pointType}
                    </span>
                    <div className="flex items-center mt-1 flex-wrap max-w-[200px] space-x-2">
                      {circles}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {stepType === "day" &&
                  typeof completedCount === "number" &&
                  completedCount > 0 ? (
                    <span className="text-lg font-semibold text-green-500 flex items-center">
                      <Plus size={14} />
                      {score} <X size={15} /> {completedCount}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-green-500 flex items-center">
                      <Plus size={14} />
                      {score}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-0 px-1">
              {renderSections ? (
                renderSections()
              ) : (
                <JournalEntryDisciplineList
                  title={title}
                  items={data}
                  stepType={stepType}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
