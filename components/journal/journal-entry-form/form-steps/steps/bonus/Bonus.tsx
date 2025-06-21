"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { WillpowerScoreDisplay } from "@components/journal/journal-entry-form/form-steps/WillpowerScoreDisplay";
import { JournalEntryDisciplineList } from "@components/journal/journal-entry-card/JournalEntryDisciplineList";
import { useYesterdayJournalEntry } from "@hooks/journal/useYesterdayJournalEntry";
import { BonusStepTabHeader } from "./BonusStepTabHeader";
import { JOURNAL_COLORS } from "@lib/colors";
import { useDisciplinesData } from "@hooks/disciplines/useDisciplineData";
import { Skeleton } from "@components/ui/skeleton";

export function Bonus() {
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    bonusWillpower,
    nightEntryDisciplineScores,
  } = useYesterdayJournalEntry();

  const { disciplineData, isLoading } = useDisciplinesData(
    yesterdayEntry?.dayEntry,
    yesterdayEntry?.nightEntry
  );

  const isDisciplineId = (step: string): boolean => {
    return /^[a-f\d]{24}$/i.test(step) || disciplineData[step] !== undefined;
  };

  const getDisciplineDisplayName = (disciplineKey: string): string => {
    if (isDisciplineId(disciplineKey) && disciplineData[disciplineKey]) {
      return disciplineData[disciplineKey].name;
    }
    // Fallback to capitalized key
    return disciplineKey.charAt(0).toUpperCase() + disciplineKey.slice(1);
  };

  // Dynamically generate tab data from nightEntryDisciplineScores
  const tabData = useMemo(() => {
    // Early return if no data is available
    if (
      !yesterdayEntry ||
      !yesterdayEntry.nightEntry ||
      !nightEntryDisciplineScores
    ) {
      return [];
    }

    const nightEntry = yesterdayEntry.nightEntry;
    const tabs: any[] = [];

    const createTab = (scoreKey: string) => {
      let disciplineKey: string;
      let entryKey: string;
      let stepType: string;
      let title = "";

      // Map the score keys to actual data keys and discipline info
      if (scoreKey === "_motivationMultiplier") {
        disciplineKey = "motivation";
        entryKey = "night";
        stepType = "night";
        title = "What made yesterday great!";
      } else if (scoreKey === "_highlightsScore") {
        disciplineKey = "highlights";
        entryKey = "highlights";
        stepType = "highlights";
        title = "What else made yesterday great...";
      } else {
        // Regular discipline ID
        disciplineKey = scoreKey;
        entryKey = scoreKey;
        stepType = "nightEntry";
      }

      // Check if the corresponding entry exists and has data
      if (
        Array.isArray(nightEntry[entryKey]) &&
        (nightEntry[entryKey] as string[]).length > 0
      ) {
        const score = nightEntryDisciplineScores[scoreKey] || 0;
        const isDiscipline = isDisciplineId(disciplineKey);
        const disciplineInfo = isDiscipline
          ? disciplineData[disciplineKey]
          : null;

        // Get the display name
        let scoreName: string;
        if (disciplineKey === "motivation") {
          scoreName = "Motivation";
        } else if (disciplineKey === "highlights") {
          scoreName = "Highlights";
        } else {
          scoreName =
            disciplineInfo?.name || getDisciplineDisplayName(disciplineKey);
        }

        return {
          step: entryKey, // Use the entry key for the tab value
          disciplineKey, // Keep the original discipline key for reference
          scoreKey, // Keep the score key for reference
          title,
          items: nightEntry[entryKey] || [],
          score,
          scoreName,
          type: stepType,
          // Add discipline-specific data (only for actual disciplines, not special steps)
          icon: disciplineInfo?.icon,
          color: disciplineInfo?.color,
          disciplineTitle: disciplineInfo?.title,
        };
      }
      return null;
    };

    // Process in specific order: Motivation first, then Highlights, then other disciplines
    const allScoreKeys = Object.keys(nightEntryDisciplineScores);

    // 1. Add Motivation first (if it exists)
    if (allScoreKeys.includes("_motivationMultiplier")) {
      const motivationTab = createTab("_motivationMultiplier");
      if (motivationTab) tabs.push(motivationTab);
    }

    // 2. Add Highlights second (if it exists)
    if (allScoreKeys.includes("_highlightsScore")) {
      const highlightsTab = createTab("_highlightsScore");
      if (highlightsTab) tabs.push(highlightsTab);
    }

    // 3. Add all other discipline IDs
    allScoreKeys
      .filter(
        (key) => key !== "_motivationMultiplier" && key !== "_highlightsScore"
      )
      .forEach((scoreKey) => {
        const disciplineTab = createTab(scoreKey);
        if (disciplineTab) tabs.push(disciplineTab);
      });

    console.log("Generated tabs:", tabs);
    return tabs;
  }, [yesterdayEntry, nightEntryDisciplineScores, disciplineData]);

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabData.length > 0 && activeTab === "") {
      setActiveTab(tabData[0].step);
    }
  }, [tabData, activeTab]);

  const loadContent = (tab: string) => {
    setActiveTab(tab);
  };

  // Show loading skeleton if discipline data is still loading and we have discipline IDs
  if (isLoading && tabData.some((tab) => isDisciplineId(tab.disciplineKey))) {
    return (
      <JournalStepTemplate
        title={"Willpower Bonus"}
        description="Gain bonus Willpower from yesterday's evening journaling."
        scoreSection={
          <WillpowerScoreDisplay willpower="??" color={JOURNAL_COLORS.night} />
        }
      >
        <div className="w-full max-w-md mx-auto p-4 pt-0">
          <BonusLoadingSkeleton />
        </div>
      </JournalStepTemplate>
    );
  }

  if (tabData.length === 0) {
    return null; // Or return a message that there's no data to display
  }

  return (
    <JournalStepTemplate
      title={"Willpower Bonus"}
      description="Gain bonus Willpower from yesterday's evening journaling."
      scoreSection={
        <WillpowerScoreDisplay
          willpower={yesterdayEntryLoading ? "??" : `+${bonusWillpower || 0}`}
          color={JOURNAL_COLORS.night}
        />
      }
    >
      <div className="w-full max-w-md mx-auto p-4 pt-0">
        <Tabs value={activeTab} className="w-full">
          <div className="sticky top-0 z-10 bg-background shadow-md">
            <TabsList className="flex justify-around h-24 bg-background">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.step}
                  className="p-0 w-11 h-11 flex flex-col items-center justify-center rounded-full data-[state=active]:bg-muted"
                  value={tab.step}
                  onClick={() => loadContent(tab.step)}
                >
                  <BonusStepTabHeader
                    count={tab.items.length}
                    stepType={tab.type}
                    stepDiscipline={tab.step}
                    disciplineIcon={tab.icon}
                    disciplineColor={tab.color}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabData.map((tab) => (
            <TabsContent key={tab.step} value={tab.step}>
              <Card className="border-none bg-muted/30">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center mr-2">
                        <div
                          className={`font-semibold text-lg flex items-center ${
                            tab.color
                              ? `text-${tab.color}`
                              : `text-${JOURNAL_COLORS.score}`
                          }`}
                        >
                          <span className="text-sm">
                            {tab.scoreName === "Motivation" ? "x" : "+"}
                          </span>
                          {tab.score}
                        </div>
                      </div>
                      <div className="flex items-center capitalize text-lg font-semibold">
                        {tab.scoreName}
                      </div>
                    </div>
                  </div>

                  <JournalEntryDisciplineList
                    title={tab.disciplineTitle || tab.title}
                    items={tab.items}
                    stepType={tab.type}
                    contentLoading={yesterdayEntryLoading}
                    bonusList
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </JournalStepTemplate>
  );
}

// Loading skeleton component
function BonusLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-around h-24 bg-background">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="w-11 h-11 rounded-full" />
          ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
