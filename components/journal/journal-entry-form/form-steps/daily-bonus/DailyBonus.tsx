import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { JournalEntryDisciplineList } from "@components/journal/journal-entry-card/JournalEntryDisciplineList";
import { FaBoltLightning } from "react-icons/fa6";
import { useYesterdayJournalEntry } from "@hooks/journal/useYesterdayJournalEntry";
import { stepIconMap } from "@components/ui/constants";
import { BonusStepTabHeader } from "./BonusStepTabHeader";
import { X, Plus } from "lucide-react";
import { JOURNAL_COLORS } from "@lib/colors";
import { calculateStepScore } from "@lib/score";

export function DailyBonus() {
  // NOTE: again no error handling
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    bonusWillpower,
    howGreatTodayBonusWillpower,
    dailyHighlightsBonusWillpower,
    learnedTodayBonusWillpower,
  } = useYesterdayJournalEntry();

  const stepScore = (items: string[]) => {
    const score = calculateStepScore(items ?? []);
    return (
      <span className="flex items-center text-green-500">
        <Plus size={10} />
        {score}
      </span>
    );
  };

  const tabData = useMemo(
    () =>
      [
        {
          icon: stepIconMap.night,
          stepType: "night",
          // bonusWillpowerValue: howGreatTodayBonusWillpower,
          title: "What made yesterday great",
          items: yesterdayEntry?.nightEntry?.howGreatToday || [],
          score: (
            <>
              {stepScore(yesterdayEntry?.nightEntry?.howGreatToday || [])}
              <span className="flex items-center text-green-500">
                <X size={10} />
                {(yesterdayEntry?.nightEntry?.howGreatToday || []).length + 1}
              </span>
            </>
          ),
        },
        {
          icon: stepIconMap.highlights,
          stepType: "highlights",
          // bonusWillpowerValue: dailyHighlightsBonusWillpower,
          title: "Yesterday's highlights",
          items: yesterdayEntry?.nightEntry?.dailyHighlights || [],
          score: stepScore(yesterdayEntry?.nightEntry?.dailyHighlights || []),
        },
        {
          icon: stepIconMap.reflection,
          stepType: "reflection",
          // bonusWillpowerValue: learnedTodayBonusWillpower,
          title: "What I learned yesterday",
          items: yesterdayEntry?.nightEntry?.learnedToday ?? [],
          score: stepScore(yesterdayEntry?.nightEntry?.learnedToday || []),
        },
      ].filter((tab) => tab.items.length > 0),
    [
      yesterdayEntry,
      howGreatTodayBonusWillpower,
      dailyHighlightsBonusWillpower,
      learnedTodayBonusWillpower,
    ]
  );

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabData.length > 0 && activeTab === "") {
      setActiveTab(tabData[0].stepType);
    }
  }, [tabData, activeTab]);

  const loadContent = (tab: string) => {
    setActiveTab(tab);
  };

  if (tabData.length === 0) {
    return null; // Or return a message that there's no data to display
  }

  return (
    <FormStepTemplate
      title={"Willpower Bonus"}
      scoreSection={
        <>
          <span className={`text-${JOURNAL_COLORS.night} text-bold`}>
            +{bonusWillpower}
          </span>
          <FaBoltLightning className="ml-2 text-2xl" />
        </>
      }
    >
      <div className="w-full max-w-md mx-auto p-4 pt-0">
        <Tabs value={activeTab} className="w-full">
          <div className="sticky top-0 z-10 bg-background shadow-md">
            <TabsList className="flex justify-around h-24">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.stepType}
                  className="p-0 w-[65px] h-[65px] flex flex-col items-center justify-center"
                  value={tab.stepType}
                  onClick={() => loadContent(tab.stepType)}
                >
                  <BonusStepTabHeader
                    icon={tab.icon}
                    count={tab.items.length}
                    stepType={tab.stepType}
                    // bonusWillpowerValue={tab.bonusWillpowerValue}
                    disciplineScore={tab.score}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabData.map((tab) => (
            <TabsContent key={tab.stepType} value={tab.stepType}>
              <Card>
                <CardContent className="p-4">
                  <JournalEntryDisciplineList
                    title={tab.title}
                    items={tab.items}
                    stepType={tab.stepType}
                    contentLoading={yesterdayEntryLoading}
                    bonusList
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </FormStepTemplate>
  );
}
