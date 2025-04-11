"use client";

import React from "react";
import { useEffect } from "react";
import { PageHeader } from "@components/PageHeader";
import { DisciplinesList } from "@components/disciplines/DisciplinesList";
import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useUserProfile } from "@context/UserProfileContext";

const NEW_DISCIPLINE_CARD_DETAILS = {
  symbol: <></>,
  title: "Disciplines",
  description: (
    <>
      These represent <span className="text-foreground">actions</span> that you
      can take daily to progress on your goals.
    </>
  ),
  buttonText: "Create New Discipline",
  linkTo: "/create-discipline",
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonDisciplineCard key={index} />
));

export function UserDisciplines() {
  const {
    // userProfile,
    userProfileLoading,
    userProfileError,
    refetchUserProfile,
  } = useUserProfile();

  //NOTE: should try and move the loading states inside the DisciplineStep?
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  // refetch const { disciplines } = userProfile; on mount
  // Might change the dependency to something else
  useEffect(() => {
    refetchUserProfile();
  }, []);

  // Check if any data is loading
  const isLoading = userProfileLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors
  const hasError = userProfileError || todayEntryError || lastEntryError;

  return (
    <>
      <PageHeader
        symbol={NEW_DISCIPLINE_CARD_DETAILS.symbol}
        title={NEW_DISCIPLINE_CARD_DETAILS.title}
        linkTo={NEW_DISCIPLINE_CARD_DETAILS.linkTo}
        itemsCount={0}
        disabled={true}
      />

      <>
        {isLoading ? (
          <div className="mt-4 space-y-4">{skeletonCards}</div>
        ) : !isLoading && hasError ? (
          <div>
            <span>Error:</span>
            <div>
              {userProfileError ||
                todayEntryError ||
                lastEntryError ||
                "There was an error loading your disciplines. Please try again later."}
            </div>
          </div>
        ) : (
          <>
            <DisciplinesList />
          </>
        )}
      </>
    </>
  );
}
