"use client";

import { useState } from "react";
import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
// import { JOURNAL_COLORS } from "@lib/colors";

export function PreMade({ onboarding }: { onboarding?: boolean }) {
  const [activeTab, setActiveTab] = useState<"dayEntry" | "nightEntry">(
    "dayEntry"
  );

  // Filter disciplines based on the active tab
  const filteredDisciplines = customStepConfigs.filter(
    (discipline) => discipline.type === activeTab
  );

  return (
    <>
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "dayEntry" | "nightEntry")
            }
            className="w-full"
          >
            <TabsList className="flex justify-center bg-transparent p-1">
              <TabsTrigger
                value="dayEntry"
                className="flex flex-col items-center py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:opacity-40 data-[state=inactive]:hover:opacity-60 transition-opacity border-none bg-transparent"
              >
                <IconRenderer
                  iconName={stepIconMap.day}
                  className={
                    activeTab === "dayEntry"
                      ? `text-primary`
                      : "text-muted-foreground"
                  }
                  size={28}
                />
              </TabsTrigger>
              <span className="h-full border-l mx-8" />
              <TabsTrigger
                value="nightEntry"
                className="flex flex-col items-center py-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=inactive]:opacity-40 data-[state=inactive]:hover:opacity-60 transition-opacity border-none bg-transparent"
              >
                <IconRenderer
                  iconName={stepIconMap.night}
                  className={
                    activeTab === "nightEntry"
                      ? `text-primary`
                      : "text-muted-foreground"
                  }
                  size={28}
                />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Explanatory text */}
          <p className="text-center text-sm text-muted-foreground mt-2 sm:mt-4 max-w-2xl mx-auto">
            {activeTab === "dayEntry"
              ? "Mornings are for motivation and direction."
              : "Evenings are for reflection and planning."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Accordion
          type="single"
          collapsible
          defaultValue={
            onboarding ? filteredDisciplines[0]?._id?.toString() : undefined
          }
        >
          {filteredDisciplines.map((discipline) => (
            <DisciplineFeedCard
              key={String(discipline._id)}
              step={discipline}
            />
          ))}
        </Accordion>
      </div>
    </>
  );
}
