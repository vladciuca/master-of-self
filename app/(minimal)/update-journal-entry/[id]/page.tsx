"use client";

import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";
import { useUserSettings } from "@context/UserSettingsContext";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { useFetchAndUpdateJournalEntry } from "@hooks/journal/useFetchAndUpdateJournalEntry";

import { Fa1, Fa2 } from "react-icons/fa6";
import { JournalStep } from "@components/journal/journal-entry-form/form-steps/steps/JournalStep";

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
          availableSteps={{
            gratitude: hasGratitude,
            affirmations: hasAffirmations,
            reflection: hasReflection,
            habits: hasHabits,
          }}
          willpowerMultiplier={willpowerMultiplier}
          //NOTE: need to make some kind of function that generates these
          customSteps={[
            {
              icon: <Fa1 />,
              type: "goals",
              component: (
                <JournalStep
                  type={"goals"}
                  category="day"
                  title="Test step"
                  description="test step desc"
                />
              ),
              category: "day",
              //NOTE: Here we will need to use isEvening to determine availability for night / day
              isAvailable: true,
            },
            {
              icon: <Fa2 />,
              type: "learnings",
              component: (
                <JournalStep
                  type={"learnings"}
                  category="night"
                  title="Test step"
                  description="test step desc"
                />
              ),
              category: "night",
              isAvailable: true,
            },
          ]}
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
