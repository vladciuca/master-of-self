"use client";

import React from "react";
import { JournalEntryPracticeList } from "@components/journal/journal-entry-card/JournalEntryPracticeList";
import {
  journalStepStyle,
  getJournalStepStyle,
} from "@components/ui/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import { calculateStepScore } from "@lib/score";
import { getRuntimeColorProps } from "@lib/utils";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";
import { usePracticeData } from "@hooks/practices/usePracticeData";
import { Skeleton } from "@components/ui/skeleton";
import { IconRenderer } from "@components/IconRenderer";
import { PiCaretDownFill } from "react-icons/pi";
import { stepIconMap } from "@components/ui/constants";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

type StepData = {
  step: string;
  score: number;
  data: string[];
  title?: string;
  completedCount?: number;
  renderSections?: () => React.ReactNode;
  stepType: "dayEntry" | "nightEntry";
  displayName?: string;
  icon?: string;
  color?: string;
};

type JournalEntryPracticeSectionProps = {
  dayEntry: JournalDayEntry | undefined;
  nightEntry: JournalNightEntry | undefined;
};

export function JournalEntryPracticeSection({
  dayEntry,
  nightEntry,
}: JournalEntryPracticeSectionProps) {
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined);

  // Create a mapping from _id to discipline name and other properties
  const stepConfigMap = React.useMemo(() => {
    const map: Record<
      string,
      {
        discipline: string;
        title: string;
        description: string;
        icon: string;
        color?: string;
      }
    > = {};

    customStepConfigs.forEach((config) => {
      // Convert _id to string to ensure it can be used as an object key
      const idKey = String(config._id);
      map[idKey] = {
        discipline: config.discipline,
        title: config.title,
        description: config.description,
        icon: config.icon,
        color: config.color,
      };
    });

    return map;
  }, []);

  const { practiceData, isLoading } = usePracticeData(
    dayEntry,
    nightEntry,
  );

  const handleAccordionChange = (value: string) => {
    setOpenItem(value);
  };

  // Updated helper function to check if a step ID needs discipline data lookup
  const isDisciplineId = (step: string): boolean => {
    // Check if it's in our custom step configs OR if it's a MongoDB ObjectId
    return stepConfigMap[step] !== undefined || /^[a-f\d]{24}$/i.test(step);
  };

  // Updated helper function to get step display name
  function getStepDisplayName(step: string): string {
    // First check if it's in our custom step configs
    if (stepConfigMap[step]) {
      return stepConfigMap[step].discipline;
    }

    // Then check if it's in practiceData (for MongoDB ObjectIds)
    if (practiceData && practiceData[step]) {
      return practiceData[step].name;
    }

    // Fallback to capitalizing the step name
    return step.charAt(0).toUpperCase() + step.slice(1);
  }

  // Helper function to get step data (icon, title, etc.)
  function getStepData(step: string) {
    // First check custom step configs
    if (stepConfigMap[step]) {
      return {
        displayName: stepConfigMap[step].discipline,
        icon: stepConfigMap[step].icon,
        title: stepConfigMap[step].title,
        color: stepConfigMap[step].color,
      };
    }

    // Then check practiceData for MongoDB ObjectIds
    if (practiceData && practiceData[step]) {
      return {
        displayName: practiceData[step].name,
        icon: practiceData[step].icon,
        title: practiceData[step].title,
        color: practiceData[step].color,
      };
    }

    return {
      displayName: undefined,
      icon: undefined,
      title: undefined,
      color: undefined,
    };
  }

  const daySteps: StepData[] = Object.entries(dayEntry || {})
    .map(([key, value]) => {
      const stepData = getStepData(key);

      return {
        step: key,
        score: calculateStepScore(value || []),
        data: value || [],
        stepType: "dayEntry" as const,
        displayName: stepData.displayName,
        icon: stepData.icon,
        title: stepData.title,
        color: stepData.color,
      };
    })
    .filter(
      (item) =>
        item.data.length > 0 &&
        item.step !== "carryOver" &&
        item.step !== "repeat",
    );

  const nightSteps: StepData[] = Object.entries(nightEntry || {})
    .map(([key, value]) => {
      const stepData = getStepData(key);

      return {
        step: key,
        score: calculateStepScore(value || []),
        data: value || [],
        stepType: "nightEntry" as const,
        displayName: stepData.displayName,
        icon: stepData.icon,
        title: stepData.title,
        color: stepData.color,
      };
    })
    .filter((item) => item.data.length > 0);

  // Rest of your component logic remains the same...
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
  const highlights = nightEntry?.highlights || [];
  const repeat = dayEntry?.repeat || [];

  const practiceStep = {
    step: "discipline",
    score: calculateStepScore(allTodos),
    data: [...allTodos, ...highlights],
    completedCount: completedCount,
    highlightsCount: highlights.length,
    title: "Daily Goals",
    stepType: "dayEntry" as const,
    icon:
      highlights.length > 0
        ? stepIconMap.highlights
        : completed.length > 0
          ? stepIconMap.night
          : stepIconMap.day,
    renderSections: () => {
      return (
        <>
          {uncompleted.length > 0 && (
            <JournalEntryPracticeList
              title="What will make today great..."
              items={uncompleted}
              stepType="day"
              repeat={repeat}
            />
          )}
          {completed.length > 0 && (
            <JournalEntryPracticeList
              title="What made today great..."
              items={completed}
              stepType="night"
              repeat={repeat}
            />
          )}
          {highlights.length > 0 && (
            <JournalEntryPracticeList
              title="What else made today great..."
              items={highlights}
              stepType="highlights"
            />
          )}
        </>
      );
    },
  };

  // Create empty array for the final ordered steps
  const orderedSteps: StepData[] = [];

  // 1. First add all regular day steps (filtering out the special "day" step)
  daySteps.forEach((step) => {
    if (step.step !== "day") {
      orderedSteps.push(step);
    }
  });

  // 2. Add the discipline step in the middle
  if (allTodos.length > 0 || highlights.length > 0) {
    orderedSteps.push(practiceStep);
  }

  // 3. Add all night steps (filtering out the special "night" step)
  nightSteps.forEach((step) => {
    if (step.step !== "night" && step.step !== "highlights") {
      if (step.step === practiceStep.step) return;

      const existingIndex = orderedSteps.findIndex((s) => s.step === step.step);
      if (existingIndex >= 0) {
        orderedSteps[existingIndex].data = [
          ...orderedSteps[existingIndex].data,
          ...step.data,
        ];
        orderedSteps[existingIndex].score += step.score;
        orderedSteps[existingIndex].stepType = "nightEntry";
      } else {
        orderedSteps.push(step);
      }
    }
  });

  if (isLoading && orderedSteps.some((step) => isDisciplineId(step.step))) {
    return <DisciplineSectionSkeleton stepCount={orderedSteps.length} />;
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="grid grid-cols-1 gap-2 p-0 m-0"
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
          renderSections,
          displayName,
          icon,
          color,
        } = item;

        if (!data || data.length === 0) return null;

        const { bgColor } = getJournalStepStyle(stepType);

        const dayBgColor = journalStepStyle.day.bgColor;
        const nightBgColor = journalStepStyle.night.bgColor;
        const highlightsBgColor = journalStepStyle.highlights.bgColor;

        const circles = Array.from({ length: data.length }).map((_, index) => {
          let circleBgColor = bgColor;
          if (step === "discipline") {
            const uncomp = uncompleted.length;
            const comp = completed.length;

            if (index < uncomp) {
              circleBgColor = dayBgColor;
            } else if (index < uncomp + comp) {
              circleBgColor = nightBgColor;
            } else {
              circleBgColor = highlightsBgColor;
            }
          }

          return (
            <div
              key={index}
              className={`${circleBgColor} w-2 h-2 rounded-full`}
            />
          );
        });

        const stepDisplayText = (() => {
          // First check custom step configs for discipline
          if (stepConfigMap[step]) {
            return stepConfigMap[step].discipline;
          }

          // Then check practiceData for MongoDB ObjectIds
          if (practiceData && practiceData[step]) {
            return practiceData[step].name;
          }

          // Fallback to capitalizing the step name
          return step.charAt(0).toUpperCase() + step.slice(1);
        })();

        const iconColorProps = getRuntimeColorProps(color, "text");

        return (
          <AccordionItem
            key={step}
            value={step}
            className="border-none rounded-lg overflow-hidden p-0 mb-0"
          >
            <IndicatorAccordionTrigger
              className="hover:no-underline py-0 group"
              hideIndicator
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <PiCaretDownFill className="h-3 w-4 flex-shrink-0 text-primary transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  {icon && (
                    <div className="w-10 h-10 flex items-center justify-center border border-primary rounded-full p-1 flex-shrink-0">
                      <IconRenderer
                        iconName={
                          step === "highlights" ? stepIconMap.highlights : icon
                        }
                        className={iconColorProps.className ?? "text-primary"}
                        style={iconColorProps.style}
                        size={
                          step === "discipline" || step === "highlights"
                            ? 22
                            : 30
                        }
                      />
                    </div>
                  )}
                  <div className="ml-1 flex-1 flex justify-start">
                    {openItem === step ? (
                      <span className="font-medium text-muted-foreground capitalize delay-100 duration-200 transition-opacity">
                        {stepDisplayText}
                      </span>
                    ) : (
                      <div
                        className={`flex flex-wrap justify-start gap-1.5 mr-3 transition-all duration-100 ${
                          openItem === step
                            ? "opacity-0"
                            : "delay-100 duration-200 opacity-100"
                        }`}
                      >
                        {circles}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center h-full">
                  {step === "discipline" ? (
                    <span
                      className="text-lg font-semibold text-journal-score flex items-center"
                    >
                      +
                      {(() => {
                        const dayScore = calculateStepScore(
                          dayEntry?.day || [],
                        );
                        const highlightsScore = calculateStepScore(
                          nightEntry?.highlights || [],
                        );
                        const baseScore = dayScore + highlightsScore;
                        const nightItems = nightEntry?.night || [];
                        const nightMultiplier =
                          nightItems.length > 0 ? nightItems.length + 1 : 1;
                        return baseScore * nightMultiplier;
                      })()}
                    </span>
                  ) : (
                    <span
                      className="text-lg font-semibold text-journal-score flex items-center"
                    >
                      +{score}
                    </span>
                  )}
                </div>
              </div>
            </IndicatorAccordionTrigger>
            <AccordionContent className="pb-2 pt-0 px-2">
              {renderSections ? (
                renderSections()
              ) : (
                <>
                  <JournalEntryPracticeList
                    title={title || ""}
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

function DisciplineSectionSkeleton({ stepCount = 3 }: { stepCount?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Array(stepCount)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} className="w-full h-6 rounded-md" />
        ))}
    </div>
  );
}
