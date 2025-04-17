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

export function Bonus() {
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    bonusWillpower,
    nightEntryDisciplineScores,
  } = useYesterdayJournalEntry();

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

    // Get all discipline keys from nightEntryDisciplineScores
    //NOTE: this are now IDs
    return Object.keys(nightEntryDisciplineScores)
      .filter((disciplineKey) => {
        // Make sure the corresponding entry exists in nightEntry and is not empty
        const entryKey =
          disciplineKey === "motivation" ? "night" : disciplineKey;
        return (
          Array.isArray(nightEntry[entryKey]) &&
          (nightEntry[entryKey] as string[]).length > 0
        );
      })
      .map((disciplineKey) => {
        // Special case for "motivation" discipline (maps to "night" entry)
        const isMotivation = disciplineKey === "motivation";
        const entryKey = isMotivation ? "night" : disciplineKey;
        const type = isMotivation ? "night" : "nightEntry";

        // Generate title based on discipline
        const title = isMotivation ? "What made yesterday great!" : "";

        // Get the score
        const score = nightEntryDisciplineScores[disciplineKey] || 0;

        // Format the score name (capitalize first letter)
        const scoreName =
          disciplineKey.charAt(0).toUpperCase() + disciplineKey.slice(1);

        return {
          step: entryKey, // Use the entry key for the tab value
          title,
          items: nightEntry[entryKey] || [],
          score,
          scoreName,
          type,
        };
      });
  }, [yesterdayEntry, nightEntryDisciplineScores]);

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabData.length > 0 && activeTab === "") {
      setActiveTab(tabData[0].step);
    }
  }, [tabData, activeTab]);

  const loadContent = (tab: string) => {
    setActiveTab(tab);
  };

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
                          className={`text-${JOURNAL_COLORS.score} font-semibold text-lg flex items-center`}
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
                    title={tab.title}
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
