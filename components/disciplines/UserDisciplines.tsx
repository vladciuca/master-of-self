// import React from "react";
// import { useRouter } from "next/navigation";
// import { DisciplinesList } from "@components/disciplines/DisciplinesList";
// import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
// import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
// import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
// import { useDisciplineList } from "@hooks/user/useDisciplineList";
// import { Discipline } from "@models/mongodb";

// const skeletonCards = Array.from({ length: 3 }, (_, index) => (
//   <SkeletonDisciplineCard key={index} />
// ));

// export function UserDisciplines() {
//   const router = useRouter();
//   const {
//     learnedDisciplineList,
//     disciplinesConfigsLoading,
//     disciplinesConfigsError,
//   } = useDisciplineList();

//   //NOTE: should try and move the loading states inside the DisciplineStep?
//   const { todayEntry, todayEntryLoading, todayEntryError } =
//     useTodayJournalEntry();
//   const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

//   const handleEdit = (discipline: Discipline) => {
//     router.push(`/update-discipline/${discipline._id}`);
//   };

//   // Check if any data is loading
//   const isLoading =
//     disciplinesConfigsLoading || todayEntryLoading || lastEntryLoading;

//   // Check for any errors
//   const hasError =
//     disciplinesConfigsLoading || todayEntryError || lastEntryError;

//   return (
//     <>
//       <>
//         {isLoading ? (
//           <div className="space-y-4">{skeletonCards}</div>
//         ) : !isLoading && hasError ? (
//           <div>
//             <span>Error:</span>
//             <div>
//               {disciplinesConfigsLoading ||
//                 todayEntryError ||
//                 lastEntryError ||
//                 "There was an error loading your disciplines. Please try again later."}
//             </div>
//           </div>
//         ) : (
//           <>
//             <DisciplinesList
//               // disciplineList={disciplineList}
//               disciplineList={learnedDisciplineList}
//               handleEdit={handleEdit}
//             />
//           </>
//         )}
//       </>
//     </>
//   );
// }
import React from "react";
import { useRouter } from "next/navigation";
import { DisciplinesList } from "@components/disciplines/DisciplinesList";
import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useDisciplineList } from "@hooks/user/useDisciplineList";
import { Discipline } from "@models/mongodb";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonDisciplineCard key={index} />
));

export function UserDisciplines() {
  const router = useRouter();
  const {
    learnedDisciplineList,
    disciplinesConfigsLoading,
    disciplinesConfigsError,
  } = useDisciplineList();

  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  const handleEdit = (discipline: Discipline) => {
    router.push(`/update-discipline/${discipline._id}`);
  };

  // Check if any data is loading
  const isLoading =
    disciplinesConfigsLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors - FIX: don't include loading state in error check
  const hasError = disciplinesConfigsError || todayEntryError || lastEntryError;

  return (
    <>
      {isLoading ? (
        <div className="space-y-4">{skeletonCards}</div>
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
        <DisciplinesList
          disciplineList={learnedDisciplineList}
          handleEdit={handleEdit}
        />
      )}
    </>
  );
}
