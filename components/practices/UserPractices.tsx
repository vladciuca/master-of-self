import React from "react";
import { useRouter } from "next/navigation";
import { PracticesList } from "@components/practices/PracticesList";
// import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { usePracticeList } from "@hooks/user/usePracticeList";
import { Practice } from "@models/mongodb";

import { Skeleton } from "@components/ui/skeleton";

// const skeletonCards = Array.from({ length: 3 }, (_, index) => (
//   <SkeletonDisciplineCard key={index} />
// ));

export function UserPractices({ onboarding }: { onboarding?: boolean }) {
  const router = useRouter();
  const {
    learnedPracticeList,
    activePracticeSteps,
    practicesConfigsLoading,
    practicesConfigsError,
  } = usePracticeList();

  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  const handleEdit = (practice: Practice) => {
    router.push(`/update-practice/${practice._id}`);
  };

  // Render the loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-8 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={`skeleton-${i}`} className="flex items-center mb-3">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <div className="flex-1">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Check if any data is loading
  const isLoading =
    practicesConfigsLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors - FIX: don't include loading state in error check
  const hasError = practicesConfigsError || todayEntryError || lastEntryError;

  return (
    <>
      {isLoading ? (
        <div className={onboarding ? "space-y-4 mt-8 sm:mt-16" : "space-y-4"}>
          {renderSkeletons()}
        </div>
      ) : hasError ? (
        <div>
          <span>Error:</span>
          <div>
            {practicesConfigsError ||
              todayEntryError ||
              lastEntryError ||
              "There was an error loading your practices. Please try again later."}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <PracticesList
            practiceList={learnedPracticeList}
            activePracticeList={activePracticeSteps}
            handleEdit={handleEdit}
            onboarding={onboarding}
          />
        </div>
      )}
    </>
  );
}
