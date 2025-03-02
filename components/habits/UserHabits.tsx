"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageHeader";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { useUserHabits } from "@hooks/useUserHabits";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/useLastJournalEntry";
import { useCreateJournalEntry } from "@hooks/useCreateJournalEntry";
import { Habit } from "@models/types";

// TEST: for implementing merge function of Default Habit Values with Journal Value
// import { useJournalHabitsSync } from "@hooks/useJournalHabitsSync";

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
  const { createJournalEntry, submitting } = useCreateJournalEntry();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { lastEntry, lastEntryLoading } = useLastJournalEntry();
  const router = useRouter();

  // console.log("===SYNC", useJournalHabitsSync());

  const numberOfEntries = habitsLoading ? "?" : habits.length;

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

  const habitActionsFromEntry = useMemo(() => {
    if (todayEntryLoading || lastEntryLoading) {
      return null;
    }
    return todayEntry?.habits || lastEntry?.habits || null;
  }, [todayEntry, lastEntry, todayEntryLoading, lastEntryLoading]);

  const lastEntryWillpower = useMemo(() => {
    if (todayEntryLoading || lastEntryLoading) {
      return 0;
    }

    const lastEntryDailyWillpower = todayEntry?.dailyWillpower || 0;
    const lastEntryBonusWillpower = todayEntry?.bonusWillpower || 0;
    const lastEntryTotalWillpower =
      lastEntryDailyWillpower + lastEntryBonusWillpower;

    return lastEntryTotalWillpower;
  }, [todayEntry, lastEntry, todayEntryLoading, lastEntryLoading]);

  const entryLoading = todayEntryLoading || lastEntryLoading;

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
          // handleDelete={handleDelete}
          entryLoading={entryLoading}
          habitActionsFromEntry={habitActionsFromEntry || {}}
          lastEntryWillpower={lastEntryWillpower}
          submittingJournalEntry={submitting}
          handleActionUpdate={handleActionUpdate}
          hasNoEntryToday={!todayEntry}
        />
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <section className="text-center mt-32">
            <p className="leading-7 mt-6 mx-3">
              Create habits that you can track daily and visualize your
              progress.
            </p>
          </section>
        </div>
      )}

      {habitsError && <p>Error: {habitsError}</p>}
    </div>
  );
}
