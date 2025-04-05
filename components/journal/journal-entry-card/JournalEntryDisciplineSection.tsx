import React from "react";
import { JournalEntryDisciplineList } from "@components/journal/journal-entry-card/JournalEntryDisciplineList";
import {
  stepDisciplines,
  journalStepStyle,
  getJournalStepStyle,
} from "@components/ui/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calculateStepScore } from "@lib/score";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";

type StepData = {
  step: string;
  score: number;
  data: string[];
  title?: string;
  completedCount?: number;
  renderSections?: () => React.ReactNode;
  stepType: "dayEntry" | "nightEntry";
};

type JournalEntryDisciplineSectionProps = {
  dayEntry: JournalDayEntry | undefined;
  nightEntry: JournalNightEntry | undefined;
};

export function JournalEntryDisciplineSection({
  dayEntry,
  nightEntry,
}: JournalEntryDisciplineSectionProps) {
  // Add state to track which accordion item is open
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  // Handler for accordion value change
  const handleAccordionChange = (value: string) => {
    setOpenItem(value);
  };

  function getStepTitle(step: string): string {
    // Capitalize first letter of the step type
    return step.charAt(0).toUpperCase() + step.slice(1);
  }

  const daySteps: StepData[] = Object.entries(dayEntry || {})
    .map(([key, value]) => {
      return {
        step: key,
        score: calculateStepScore(value || []),
        data: value || [],
        stepType: "dayEntry" as const,
      };
    })
    .filter((item) => item.data.length > 0);

  const nightSteps: StepData[] = Object.entries(nightEntry || {})
    .map(([key, value]) => {
      return {
        step: key,
        score: calculateStepScore(value || []),
        data: value || [],
        stepType: "nightEntry" as const,
      };
    })
    .filter((item) => item.data.length > 0);

  // Special handling for day and night step types for Motivation
  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.day || [];
    const completedToDos = nightEntry?.night || [];
    return completedToDos.filter((item) => dailyToDos.includes(item));
  };

  const uncompletedDailyToDos = () => {
    const dailyToDos = dayEntry?.day || [];
    const completedToDos = new Set(nightEntry?.night);
    return dailyToDos.filter((item) => !completedToDos.has(item));
  };

  const completed = completedDailyToDos();
  const uncompleted = uncompletedDailyToDos();
  const allTodos = [...uncompleted, ...completed];
  const completedCount = completed.length;

  const motivationStep = {
    step: "day",
    score: calculateStepScore(allTodos),
    data: allTodos,
    completedCount: completedCount,
    title: "Daily Goals",
    stepType: "dayEntry" as const,
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
  };

  // Create empty array for the final ordered steps
  let orderedSteps: StepData[] = [];

  // 1. First add all regular day steps (filtering out the special "day" step)
  daySteps.forEach((step) => {
    if (step.step !== "day") {
      orderedSteps.push(step);
    }
  });

  // 2. Add the motivation step in the middle
  if (allTodos.length > 0) {
    orderedSteps.push(motivationStep);
  }

  // 3. Add all night steps (filtering out the special "night" step)
  nightSteps.forEach((step) => {
    if (step.step !== "night") {
      // Check if this step type already exists in the ordered steps
      const existingIndex = orderedSteps.findIndex((s) => s.step === step.step);
      if (existingIndex >= 0) {
        // If step type exists, merge the data
        orderedSteps[existingIndex].data = [
          ...orderedSteps[existingIndex].data,
          ...step.data,
        ];
        orderedSteps[existingIndex].score += step.score;
        orderedSteps[existingIndex].stepType = "nightEntry";
      } else {
        // Otherwise add as a new step
        orderedSteps.push(step);
      }
    }
  });

  return (
    <Accordion
      type="single"
      collapsible
      className="grid grid-cols-1 gap-3 p-0 m-0"
      value={openItem}
      onValueChange={handleAccordionChange}
    >
      {orderedSteps.map((item) => {
        const {
          step,
          score,
          data,
          title,
          stepType,
          completedCount,
          renderSections,
        } = item;

        if (!data || data.length === 0) return null;

        const pointType = stepDisciplines[step] || getStepTitle(step);

        let { bgColor } = getJournalStepStyle(step);

        // For steps other than "day" and "night", use the stepType to determine color
        if (step !== "day" && step !== "night") {
          // Use getJournalStepStyle to get the appropriate color based on stepType
          const stepTypeStyle = getJournalStepStyle(stepType);
          bgColor = stepTypeStyle.bgColor;
        }

        // Get day and night colors directly from stepStyles
        const dayBgColor = journalStepStyle.day.bgColor;
        const nightBgColor = journalStepStyle.night.bgColor;

        // Create circles with different colors based on completion status
        const circles = Array.from({ length: data.length }).map((_, index) => {
          // For the day step, use different colors for completed vs uncompleted
          let circleBgColor = bgColor;

          if (step === "day" && typeof completedCount === "number") {
            // If this is a completed circle (index >= uncompleted count)
            circleBgColor =
              index >= data.length - completedCount ? nightBgColor : dayBgColor;
          }

          return (
            <div
              key={index}
              className={`${circleBgColor} w-2 h-2 rounded-full`}
            />
          );
        });

        return (
          <AccordionItem
            key={step}
            value={step}
            className="border-none bg-muted/30 rounded-lg overflow-hidden py-0 pl-2 px-4 mb-0"
          >
            <AccordionTrigger
              className={`hover:no-underline flex flex-col items-start pt-2 ${
                openItem !== step ? "pb-2" : "pb-0"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col h-full">
                    <span className="font-medium text-muted-foreground flex items-start">
                      {pointType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {step === "day" &&
                  typeof completedCount === "number" &&
                  completedCount > 0 ? (
                    <span
                      className={`text-lg font-semibold text-${JOURNAL_COLORS.score} flex items-center`}
                    >
                      +{score * (completedCount + 1)}
                    </span>
                  ) : (
                    <span
                      className={`text-lg font-semibold text-${JOURNAL_COLORS.score} flex items-center`}
                    >
                      +{score}
                    </span>
                  )}
                </div>
              </div>
              {/* Only show circles when this item is not open */}
              <div
                className={`overflow-hidden flex flex-wrap max-w-[180px] sm:max-w-[200px] gap-2 transition-all duration-100 ${
                  openItem === step
                    ? "opacity-0 max-h-0"
                    : "transition-[max-height] delay-100 duration-200 opacity-100 max-h-[500px]"
                }`}
              >
                {circles}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2 pt-0">
              {renderSections ? (
                renderSections()
              ) : (
                <>
                  <JournalEntryDisciplineList
                    title={title}
                    items={data}
                    stepType={stepType}
                  />
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
