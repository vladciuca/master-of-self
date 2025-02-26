import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { JournalEntrySection } from "@components/journal/journal-entry-card/JournalEntrySection";
import { FaBoltLightning } from "react-icons/fa6";
import { useYesterdayJournalEntry } from "@hooks/useYesterdayJournalEntry";
import { stepIconMap } from "@components/ui/constants";
import { BonusStepTabHeader } from "./BonusStepTabHeader";
import { JOURNAL_COLORS } from "@lib/colors";

type DailyBonusProps = {
  bonusWillpower: number;
};

export function DailyBonus({ bonusWillpower }: DailyBonusProps) {
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    // bonusWillpower,
    howGreatTodayBonusWillpower,
    dailyHighlightsBonusWillpower,
    learnedTodayBonusWillpower,
  } = useYesterdayJournalEntry();

  // console.log(
  //   "===yday entry should not exist why is it returning todays entry as yday?",
  //   yesterdayEntry
  // );

  const tabData = useMemo(
    () =>
      [
        {
          icon: stepIconMap.night,
          stepType: "night",
          bonusWillpowerValue: howGreatTodayBonusWillpower,
          title: "What made yesterday great",
          items: yesterdayEntry?.nightEntry?.howGreatToday || [],
        },
        {
          icon: stepIconMap.highlights,
          stepType: "highlights",
          bonusWillpowerValue: dailyHighlightsBonusWillpower,
          title: "Yesterday's highlights",
          items: yesterdayEntry?.nightEntry?.dailyHighlights || [],
        },
        {
          icon: stepIconMap.reflection,
          stepType: "reflection",
          bonusWillpowerValue: learnedTodayBonusWillpower,
          title: "What I learned yesterday",
          items: yesterdayEntry?.nightEntry?.learnedToday || [],
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
          <span className={`text-${JOURNAL_COLORS.night}`}>
            +{bonusWillpower}
          </span>
          <FaBoltLightning className="ml-2 text-3xl" />
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
                  className="w-[75px] h-[65px] flex flex-col items-center justify-center"
                  value={tab.stepType}
                  onClick={() => loadContent(tab.stepType)}
                >
                  <BonusStepTabHeader
                    icon={tab.icon}
                    count={tab.items.length}
                    stepType={tab.stepType}
                    bonusWillpowerValue={tab.bonusWillpowerValue}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabData.map((tab) => (
            <TabsContent key={tab.stepType} value={tab.stepType}>
              <Card>
                <CardContent className="p-4">
                  <JournalEntrySection
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
