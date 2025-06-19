import React from "react";
import { useRouter } from "next/navigation";
import { DisciplinesList } from "@components/disciplines/DisciplinesList";
// import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useDisciplineList } from "@hooks/user/useDisciplineList";
import { Discipline } from "@models/mongodb";

import { Skeleton } from "@components/ui/skeleton";

// const skeletonCards = Array.from({ length: 3 }, (_, index) => (
//   <SkeletonDisciplineCard key={index} />
// ));

export function UserDisciplines() {
  const router = useRouter();
  const {
    learnedDisciplineList,
    activeDisciplineSteps,
    disciplinesConfigsLoading,
    disciplinesConfigsError,
  } = useDisciplineList();

  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  const handleEdit = (discipline: Discipline) => {
    router.push(`/update-discipline/${discipline._id}`);
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
    disciplinesConfigsLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors - FIX: don't include loading state in error check
  const hasError = disciplinesConfigsError || todayEntryError || lastEntryError;

  return (
    <>
      {isLoading ? (
        <div className="space-y-4">{renderSkeletons()}</div>
      ) : hasError ? (
        <div>
          <span>Error:</span>
          <div>
            {disciplinesConfigsError ||
              todayEntryError ||
              lastEntryError ||
              "There was an error loading your disciplines. Please try again later."}
          </div>
        </div>
      ) : (
        <>
          <DisciplinesList
            disciplineList={learnedDisciplineList}
            activeDisciplineList={activeDisciplineSteps}
            handleEdit={handleEdit}
          />
        </>
      )}
    </>
  );
}
