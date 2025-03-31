import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { WillpowerScoreDisplay } from "@components/journal/journal-entry-form/form-steps/WillpowerScoreDisplay";
import { JournalEntryDisciplineList } from "@components/journal/journal-entry-card/JournalEntryDisciplineList";
import { useYesterdayJournalEntry } from "@hooks/journal/useYesterdayJournalEntry";
import { stepIconMap } from "@components/ui/constants";
import { BonusStepTabHeader } from "./BonusStepTabHeader";
import { Plus } from "lucide-react";
import { JOURNAL_COLORS } from "@lib/colors";

//NOTE: Add a loading state here.........
export function Bonus() {
  // NOTE: again no error handling
  const {
    yesterdayEntry,
    yesterdayEntryLoading,
    bonusWillpower,
    nightEntryDisciplineScores,
  } = useYesterdayJournalEntry();

  const stepScore = (score: number) => {
    return (
      <span
        className={`flex items-center text-${JOURNAL_COLORS.score} font-bold`}
      >
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
          title: "What made yesterday great!",
          items: yesterdayEntry?.nightEntry?.night ?? [],
          score: nightEntryDisciplineScores.motivation,
          //NOTE: Here we can use the key as scoreName when building it to have dynamic steps
          scoreName: "Motivation",
        },
        {
          icon: stepIconMap.highlights,
          stepType: "highlights",
          title: "Yesterday's highlights!",
          items: yesterdayEntry?.nightEntry?.highlights || [],
          score: nightEntryDisciplineScores.awareness,
          scoreName: "Awareness",
        },
        {
          icon: stepIconMap.reflection,
          stepType: "reflection",
          title: "What I learned yesterday!",
          items: yesterdayEntry?.nightEntry?.reflection ?? [],
          score: nightEntryDisciplineScores.resilience,
          scoreName: "Resilience",
        },
      ].filter((tab) => tab.items.length > 0),
    [yesterdayEntry, nightEntryDisciplineScores]
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
      description="Gain bonus Willpower from yesterday's evening journaling."
      scoreSection={
        <WillpowerScoreDisplay
          willpower={yesterdayEntryLoading ? "??" : `+${bonusWillpower}`}
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
                  key={tab.stepType}
                  className="p-0 w-11 h-11 flex flex-col items-center justify-center rounded-full data-[state=active]:bg-muted"
                  value={tab.stepType}
                  onClick={() => loadContent(tab.stepType)}
                >
                  <BonusStepTabHeader
                    //NOTE right now were are mapping over a const to get the icon
                    // but after refactor with dynamic steps, we need to pass the icon
                    // icon={tab.icon}
                    count={tab.items.length}
                    stepType={tab.stepType}
                    //NOTE: here might add some loading state to the child
                    // disciplineScore={stepScore(tab.score ?? 0)}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {tabData.map((tab) => (
            <TabsContent key={tab.stepType} value={tab.stepType}>
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
