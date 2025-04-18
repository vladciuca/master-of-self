import React from "react";
import { useRouter } from "next/navigation";
import { AddNewButton } from "@components/profile/AddNewButton";
import { DisciplinesList } from "@components/disciplines/DisciplinesList";
import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
// import { useUserProfile } from "@context/UserProfileContext";
import { useDisciplineList } from "@hooks/user/useDisciplineList";
import { Discipline } from "@models/mongodb";

// const NEW_DISCIPLINE_CARD_DETAILS = {
//   symbol: <></>,
//   title: "Discipline",
//   description: (
//     <>
//       These represent <span className="text-foreground">actions</span> that you
//       can take daily to progress on your goals.
//     </>
//   ),
//   buttonText: "Create New Discipline",
//   linkTo: "/create-discipline",
// };

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonDisciplineCard key={index} />
));

export function UserDisciplines() {
  const router = useRouter();
  // const {
  //   // userProfile,
  //   userProfileLoading,
  //   userProfileError,
  //   // refetchUserProfile,
  // } = useUserProfile();
  const { disciplineList, listLoading, listError } = useDisciplineList();

  //NOTE: should try and move the loading states inside the DisciplineStep?
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  const handleEdit = (discipline: Discipline) => {
    router.push(`/update-discipline/${discipline._id}`);
  };

  // Check if any data is loading
  const isLoading =
    // userProfileLoading ||
    todayEntryLoading || lastEntryLoading;

  // Check for any errors
  const hasError =
    // userProfileError ||
    todayEntryError || lastEntryError;

  return (
    <>
      {/* <AddNewButton
        // symbol={NEW_DISCIPLINE_CARD_DETAILS.symbol}
        title={NEW_DISCIPLINE_CARD_DETAILS.title}
        linkTo={NEW_DISCIPLINE_CARD_DETAILS.linkTo}
        // itemsCount={0}
        // disabled={true}
      /> */}

      <>
        {isLoading ? (
          <div className="mt-4 space-y-4">{skeletonCards}</div>
        ) : !isLoading && hasError ? (
          <div>
            <span>Error:</span>
            <div>
              {
                // userProfileError ||
                listLoading ||
                  todayEntryError ||
                  lastEntryError ||
                  "There was an error loading your disciplines. Please try again later."
              }
            </div>
          </div>
        ) : (
          <>
            <DisciplinesList
              disciplineList={disciplineList}
              handleEdit={handleEdit}
            />
          </>
        )}
      </>
    </>
  );
}
