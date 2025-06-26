"use client";

import { useParams } from "next/navigation";
import { FormStepController } from "@components/journal/journal-entry-form/FormStepController";
import { LoadingScreen } from "@components/skeletons/LoadingScreen";
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

  const {
    activeDisciplineSteps,
    disciplinesConfigsLoading,
    disciplinesConfigsError,
  } = useDisciplineList();

  const userEveningTime = userProfile?.journalStartTime.evening;
  const willpowerMultiplier = userProfile?.willpowerMultiplier;

  const isLoading =
    journalEntryLoading ||
    userProfileLoading ||
    habitsLoading ||
    disciplinesConfigsLoading ||
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
          customSteps={activeDisciplineSteps}
          hasHabits={hasHabits}
        />
      )}
      {/* Since this is in the MINIMAL_LAYOUT, the UI of the FULL_LAYOUT needs to be recreated here
      TODO: in UI-LAYOUT-REFACTOR - Possibility to import the FULL_LAYOUT here ?*/}
      {isLoading && <LoadingScreen />}
      {journalEntryError && <div>{journalEntryError}</div>}
    </>
  );
}
