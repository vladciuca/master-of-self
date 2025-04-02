"use client";

import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";
import { useUserSettings } from "@context/UserSettingsContext";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { useFetchAndUpdateJournalEntry } from "@hooks/journal/useFetchAndUpdateJournalEntry";

import { GiAura, GiHealing, GiAwareness, GiGuardedTower } from "react-icons/gi";
import { JournalStep } from "@components/journal/journal-entry-form/form-steps/steps/JournalStep";
import type { JournalStepConfig, JournalEntryCustomStep } from "@models/types";

//NOTE: move this to hook when u make Step Collection
const customStepConfigs: JournalStepConfig[] = [
  {
    icon: <GiHealing />,
    type: "positivity",
    category: "day",
    title: "What am I feeling grateful for?",
    description:
      "Use details to describe what you're feeling grateful for and increase Positivity.",
    isAvailable: true,
  },
  {
    icon: <GiAura />,
    type: "confidence",
    category: "day",
    title: "Daily Affirmations",
    description:
      "Use statements using powerful words to imprint on your subconscious mind and build Confidence.",
    isAvailable: true,
  },
  {
    icon: <GiAwareness />,
    type: "awareness",
    category: "night",
    title: "What are today's highlights?",
    description:
      "Build momentum by capturing meaningful events and boost Awareness.",
    isAvailable: true,
  },
  {
    icon: <GiGuardedTower />,
    type: "resilience",
    category: "night",
    title: "Could today have been better?",
    description:
      "If you could go back, what would you change? Recognize what’s in your control, accept what isn’t.",
    isAvailable: true,
  },
];

const customSteps: JournalEntryCustomStep[] = customStepConfigs.map(
  (config) => ({
    icon: config.icon,
    type: config.type,
    component: (
      <JournalStep
        key={config.type}
        type={config.type}
        category={config.category}
        title={config.title}
        description={config.description}
      />
    ),
    category: config.category,
    isAvailable: config.isAvailable,
  })
);

export default function UpdateJournalEntry() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const {
    journalEntryData,
    submittingJournalEntryUpdate,
    journalEntryError,
    journalEntryLoading,
    updateJournalEntry,
  } = useFetchAndUpdateJournalEntry(id);
  //NOTE: again no error handling
  const {
    willpowerMultiplier,
    userSettings,
    userSettingsLoading,
    userSettingsError,
  } = useUserSettings();
  const { hasHabits, habitsLoading } = useUserHabits();

  const userSteps = userSettings?.steps;
  const hasGratitude = userSteps?.gratitude;
  const hasAffirmations = userSteps?.affirmations;
  const hasReflection = userSteps?.reflection;
  const userEveningTime = userSettings?.journalStartTime.evening;

  const isLoading =
    journalEntryLoading ||
    userSettingsLoading ||
    habitsLoading ||
    !journalEntryData;

  return (
    <>
      {!isLoading && journalEntryData && (
        <FormStepController
          journalEntryData={journalEntryData}
          submitting={submittingJournalEntryUpdate}
          onSubmit={updateJournalEntry}
          userEveningTime={userEveningTime}
          //NOTE: will be moved to stepConfig
          availableSteps={{
            // gratitude: hasGratitude,
            // affirmations: hasAffirmations,
            // reflection: hasReflection,
            habits: hasHabits,
          }}
          willpowerMultiplier={willpowerMultiplier}
          //NOTE: need to make some kind of function that generates these
          customSteps={customSteps}
        />
      )}
      {/* Since this is in the MINIMAL_LAYOUT, the UI of the FULL_LAYOUT needs to be recreated here
      TODO: in UI-LAYOUT-REFACTOR - Possibility to import the FULL_LAYOUT here ?*/}
      {isLoading && (
        <div className="flex flex-col w-full h-full relative sm:pt-2">
          <div className="min-h-20 flex items-center justify-center py-2 sm:mt-1 sm:mb-2">
            <HeaderTitle />
          </div>
          <div className="flex-grow overflow-hidden border rounded-3xl">
            <div className="h-full px-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <PageLogo />
            </div>
          </div>
          <div className="min-h-20">
            <div className="w-full h-full flex justify-center items-center">
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
      {journalEntryError && <div>{journalEntryError}</div>}
    </>
  );
}
