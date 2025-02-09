"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@components/PageHeader";
import { HabitList } from "@components/habits/HabitList";
import { SkeletonHabitCard } from "@components/skeletons/SkeletonHabitCard";
import { Shell } from "lucide-react";
import { useUserHabits } from "@hooks/useUserHabits";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/useLastJournalEntry";
import { useCreateJournalEntry } from "@hooks/useCreateJournalEntry";
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
  const { createJournalEntry, submitting } = useCreateJournalEntry();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { lastEntry, lastEntryLoading } = useLastJournalEntry();
  const router = useRouter();

  const numberOfEntries = habitsLoading ? "?" : habits.length;

  const handleEdit = (habit: Habit) => {
    router.push(`/update-habit/${habit._id}`);
  };

  const handleActionUpdate = async (habitId: string) => {
    if (!todayEntry?._id) {
      try {
        const newEntryId = await createJournalEntry();
        router.push(
          `/update-journal-entry/${newEntryId}?step=actions&habitId=${habitId}`,
          { scroll: false }
        );
      } catch (error) {
        console.error("Failed to create new journal entry:", error);
      }
    } else {
      router.push(
        `/update-journal-entry/${todayEntry._id}?step=actions&habitId=${habitId}`,
        { scroll: false }
      );
    }
  };

  const getActionUpdateValues = (habitId: string) => {
    if (todayEntryLoading || lastEntryLoading) return {};
    const actions = !todayEntry
      ? lastEntry?.nightEntry?.actions?.[habitId]
      : todayEntry?.nightEntry?.actions?.[habitId];

    if (!actions) return {};

    // Exclude the currentXp key
    const { currentXp, ...actionValues } = actions;
    return actionValues;
  };

  const getWillpowerMultiplier = () => {
    if (todayEntryLoading || lastEntryLoading) return 0;
    if (!todayEntry) {
      return 1 + (lastEntry?.dailyWillpower || 0) / 100;
    } else {
      return 1 + (todayEntry?.dailyWillpower || 0) / 100;
    }
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
          entryLoading={todayEntryLoading || lastEntryLoading}
          willpowerMultiplier={getWillpowerMultiplier()}
          submittingJournalEntry={submitting}
          handleActionUpdate={handleActionUpdate}
          isNotToday={!todayEntry}
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
