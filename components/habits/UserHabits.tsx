"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageHeader";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useCreateJournalEntry } from "@hooks/journal/useCreateJournalEntry";
import { Habit } from "@models/types";

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
  const router = useRouter();

  const { habits, defaultHabitActionValues, habitsLoading, habitsError } =
    useUserHabits();
  const { createJournalEntry, submittingJournalEntry } =
    useCreateJournalEntry();

  // *** NOTE: Here we only check if todayEntry exists !
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();

  // *** NOTE: lastEntry becomes todayEntry if todayEntry exists (dose not return null) !
  // NOTE: not using Loading & Error here!!!
  const {
    // lastEntry,
    habitActionsValues,
    totalWillpower,
    lastEntryLoading,
    lastEntryError,
  } = useLastJournalEntry();

  const itemsCount = habitsLoading ? "?" : habits.length;

  const handleEdit = (habit: Habit) => {
    router.push(`/update-habit/${habit._id}`);
  };

  const handleActionUpdate = async (habitId: string) => {
    if (todayEntryLoading) return;
    if (todayEntryError) return;

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

  const isEntryValid = !lastEntryLoading && !lastEntryError;

  return (
    <div className="w-full">
      <PageHeader
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
        itemsCount={itemsCount}
        //NOTE: DISABLE HABIT_CREATION
        // disabled={true}
      />

      {habitsLoading ? (
        skeletonCards
      ) : habits.length > 0 ? (
        <HabitList
          habits={habits}
          //NOTE: Default HABIT_ACTION_VALUES from habits hook
          defaultHabitActionValues={defaultHabitActionValues}
          handleEdit={handleEdit}
          // handleDelete={handleDelete} //NOTE: Test purposes
          entryLoading={lastEntryLoading}
          //NOTE: actionValues from LAST_ENTRY w/o currentXp key
          habitActionsValuesFromEntry={isEntryValid ? habitActionsValues : {}}
          //NOTE: WP from TODAY_ENTRY else LAST_ENTRY
          entryTotalWillpower={isEntryValid ? totalWillpower : 0}
          //NOTE: Check if TODAY_ENTRY exists!
          hasNoEntryToday={
            !todayEntryLoading && !todayEntryError && !todayEntry
          }
          //NOTE: for Disabling TAKE_ACTION button when creating a new Journal Entry
          submittingJournalEntry={submittingJournalEntry}
          handleActionUpdate={handleActionUpdate}
        />
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <section className="text-center mt-32">
            {/* <p className="leading-7 mt-6 mx-3">
              Create habits that you can track daily and visualize your
              progress.
            </p> */}
            <p className="leading-7 mt-6 mx-3">
              Habit creation is currently disabled for the Alpha.
            </p>
          </section>
        </div>
      )}

      {habitsError && <p>Error: {habitsError}</p>}
    </div>
  );
}
