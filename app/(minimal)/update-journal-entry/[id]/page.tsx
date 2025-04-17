"use client";

import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { PageLogo } from "@components/PageLogo";
import { HeaderTitle } from "@components/HeaderTitle";
import { useUserProfile } from "@context/UserProfileContext";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { useFetchAndUpdateJournalEntry } from "@hooks/journal/useFetchAndUpdateJournalEntry";

import { useDisciplineList } from "@hooks/user/useDisciplineList";

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
  const { userProfile, userProfileLoading, userProfileError } =
    useUserProfile();
  //NOTE: WIP - Habits
  const { hasHabits, habitsLoading } = useUserHabits();

  //NOTE: WIP hook!
  const { disciplineStepList, listLoading, listError } = useDisciplineList();

  const userEveningTime = userProfile?.journalStartTime.evening;
  const willpowerMultiplier = userProfile?.willpowerSMultiplier;

  const isLoading =
    journalEntryLoading ||
    userProfileLoading ||
    habitsLoading ||
    listLoading ||
    !journalEntryData;

  return (
    <>
      {!isLoading && journalEntryData && (
        <FormStepController
          journalEntryData={journalEntryData}
          submitting={submittingJournalEntryUpdate}
          onSubmit={updateJournalEntry}
          userEveningTime={userEveningTime}
          willpowerMultiplier={willpowerMultiplier}
          //NOTE: need to give better names to these: stepList
          // and for customSteps in maybe appSteps?
          customSteps={disciplineStepList}
          hasHabits={hasHabits}
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
