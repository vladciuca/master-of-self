// "use client";

// import { useRouter } from "next/navigation";
// import { PageHeader } from "@components/PageHeader";
// import { HabitList } from "@components/habits/HabitList";
// import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
// import { Shell } from "lucide-react";
// import { useUserHabits } from "@hooks/useUserHabits";
// import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
// import { useCreateJournalEntry } from "@hooks/useCreateJournalEntry";
// import { Habit } from "@app/types/types";

// const NEW_HABIT_CARD_DETAILS = {
//   symbol: <Shell size={"2rem"} />,
//   title: "Habits",
//   description: (
//     <>
//       These represent <span className="text-foreground">actions</span> that you
//       can take daily to progress on your goals.
//     </>
//   ),
//   buttonText: "Create New Habit",
//   linkTo: "/create-habit",
// };

// const skeletonCards = Array.from({ length: 3 }, (_, index) => (
//   <SkeletonHabitCard key={index} />
// ));

// export function UserHabits() {
//   const { habits, habitsLoading, habitsError } = useUserHabits();
//   const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
//   const { createJournalEntry, submitting } = useCreateJournalEntry();

//   const router = useRouter();

//   const numberOfEntries = habitsLoading ? "?" : habits.length;

//   const handleEdit = (habit: Habit) => {
//     router.push(`/update-habit/${habit._id}`);
//   };

//   const handleActionUpdate = async (habitId: string) => {
//     if (!todayEntry?._id) {
//       try {
//         const newEntryId = await createJournalEntry();
//         router.push(
//           `/update-journal-entry/${newEntryId}?step=habits&habitId=${habitId}`,
//           { scroll: false }
//         );
//       } catch (error) {
//         console.error("Failed to create new journal entry:", error);
//       }
//     } else {
//       router.push(
//         `/update-journal-entry/${todayEntry._id}?step=habits&habitId=${habitId}`,
//         { scroll: false }
//       );
//     }
//   };

//   // const handleDelete = async (habit: Habit) => {
//   //   const hasConfirmed = confirm("Are you sure you want to delete this habit?");

//   //   if (hasConfirmed) {
//   //     try {
//   //       await fetch(`/api/habit/${habit._id.toString()}`, { method: "DELETE" });

//   //       router.push("/habits");
//   //     } catch (error) {
//   //       console.log(error);
//   //     }
//   //   }
//   // };

//   const getActionUpdateValues = (habitId: string) => {
//     if (todayEntryLoading) return {};
//     return todayEntry?.nightEntry?.actions?.[habitId] || {};
//   };

//   return (
//     <div className="w-full">
//       <PageHeader
//         symbol={NEW_HABIT_CARD_DETAILS.symbol}
//         title={NEW_HABIT_CARD_DETAILS.title}
//         linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
//         numberOfEntries={numberOfEntries}
//       />

//       {habitsLoading ? (
//         skeletonCards
//       ) : habits.length > 0 ? (
//         <HabitList
//           habits={habits}
//           handleEdit={handleEdit}
//           // handleDelete={handleDelete}
//           getActionUpdateValues={getActionUpdateValues}
//           todayEntryLoading={todayEntryLoading}
//           willpowerMultiplier={1 + (todayEntry?.dailyWillpower || 0) / 100}
//           submittingJournalEntry={submitting}
//           handleActionUpdate={handleActionUpdate}
//         />
//       ) : (
//         <div className="text-center mt-24">
//           <h1 className="scroll-m-20 text-4xl font-bold leading-loose mb-24">
//             Start by creating a new habit!
//           </h1>
//         </div>
//       )}

//       {habitsError && <p>Error: {habitsError}</p>}
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { PageHeader } from "@components/PageHeader";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { useUserHabits } from "@hooks/useUserHabits";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { useCreateJournalEntry } from "@hooks/useCreateJournalEntry";
import { useLastUpdateTime } from "@hooks/useLastUpdateTime";
import { useYesterdayJournalEntry } from "@hooks/useYesterdayJournalEntry";
import { Habit } from "@app/types/types";

const NEW_HABIT_CARD_DETAILS = {
  symbol: <Shell size={"2rem"} />,
  title: "Habits",
  description: (
    <>
      These represent <span className="text-foreground">actions</span> that you
      can take daily to progress on your goals.
    </>
  ),
  buttonText: "Create New Habit",
  linkTo: "/create-habit",
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitCard key={index} />
));

export function UserHabits() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { createJournalEntry, submitting } = useCreateJournalEntry();
  const {
    lastUpdateTime,
    isLoading: lastUpdateLoading,
    updateHabitsIfNeeded,
  } = useLastUpdateTime();
  const { yesterdayEntry, yesterdayEntryLoading, habitsXp } =
    useYesterdayJournalEntry();

  const router = useRouter();

  const numberOfEntries = habitsLoading ? "?" : habits.length;

  const checkAndUpdateHabits = useCallback(async () => {
    console.log("Habit update check");
    console.log("===============yesterdayEntry", yesterdayEntry);
    console.log(
      "===============yesterdayEntry",
      yesterdayEntry?.nightEntry?.actions
    );
    console.log("===============habitsXp", habitsXp);

    if (
      !lastUpdateLoading &&
      !yesterdayEntryLoading &&
      yesterdayEntry &&
      Object.keys(habitsXp).length > 0
    ) {
      console.log("Habit update check triggered");
      const habitActions = yesterdayEntry?.nightEntry?.actions || {};
      await updateHabitsIfNeeded(habitsXp, habitActions);
    }
  }, [
    lastUpdateLoading,
    yesterdayEntryLoading,
    yesterdayEntry,
    habitsXp,
    updateHabitsIfNeeded,
  ]);

  useEffect(() => {
    checkAndUpdateHabits();
  }, [checkAndUpdateHabits]);

  const handleEdit = (habit: Habit) => {
    router.push(`/update-habit/${habit._id}`);
  };

  const handleActionUpdate = async (habitId: string) => {
    if (!todayEntry?._id) {
      try {
        const newEntryId = await createJournalEntry();
        router.push(
          `/update-journal-entry/${newEntryId}?step=habits&habitId=${habitId}`,
          { scroll: false }
        );
      } catch (error) {
        console.error("Failed to create new journal entry:", error);
      }
    } else {
      router.push(
        `/update-journal-entry/${todayEntry._id}?step=habits&habitId=${habitId}`,
        { scroll: false }
      );
    }
  };

  const getActionUpdateValues = (habitId: string) => {
    if (todayEntryLoading) return {};
    return todayEntry?.nightEntry?.actions?.[habitId] || {};
  };

  return (
    <div className="w-full">
      <PageHeader
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
        numberOfEntries={numberOfEntries}
      />

      {habitsLoading ? (
        skeletonCards
      ) : habits.length > 0 ? (
        <HabitList
          habits={habits}
          handleEdit={handleEdit}
          getActionUpdateValues={getActionUpdateValues}
          todayEntryLoading={todayEntryLoading}
          willpowerMultiplier={1 + (todayEntry?.dailyWillpower || 0) / 100}
          submittingJournalEntry={submitting}
          handleActionUpdate={handleActionUpdate}
        />
      ) : (
        <div className="text-center mt-24">
          <h1 className="scroll-m-20 text-4xl font-bold leading-loose mb-24">
            Start by creating a new habit!
          </h1>
        </div>
      )}

      {habitsError && <p>Error: {habitsError}</p>}
    </div>
  );
}
