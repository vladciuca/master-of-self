"use client";

import { useRouter, useParams } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useFetchAndUpdateHabit } from "@hooks/habits/useFetchAndUpdateHabit";
import { calculateHabitsXpFromEntry } from "@lib/level";

export default function UpdateHabit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const {
    habitData,
    submitting,
    habitDataLoading,
    updateHabit,
    habitDefaultXpValues,
  } = useFetchAndUpdateHabit(id);

  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { lastEntry, lastEntryLoading } = useLastJournalEntry();

  const getHabitXpFromEntry = (
    entry: any,
    loading: boolean,
    habitId: string
  ) => {
    if (loading || !entry) return 0;

    const dailyWillpower = entry?.dailyWillpower || 0;
    const bonusWillpower = entry?.bonusWillpower || 0;
    const totalWillpower = dailyWillpower + bonusWillpower;
    const habits = entry?.habits || {};

    const xpSums = calculateHabitsXpFromEntry({
      entryHabits: habits,
      entryWillpower: totalWillpower,
    });

    return xpSums[habitId] || 0;
  };

  const projectedHabitXp = getHabitXpFromEntry(
    todayEntry,
    todayEntryLoading,
    id
  );
  const unSubmittedXp = getHabitXpFromEntry(lastEntry, lastEntryLoading, id);
  const habitDefaultXp = habitData && habitDefaultXpValues(habitData);

  // ?? nullish operator so that XP will only be 0 if habit data is null or undefined
  let xp = habitData?.xp ?? 0;
  let projectedXp = projectedHabitXp;

  if (!todayEntry) {
    xp = xp + unSubmittedXp;
    projectedXp = habitDefaultXp || 0;
  }

  const handleUpdateHabit = async (habit: HabitZodType) => {
    try {
      await updateHabit(habit);
      router.push("/habits");
    } catch (error) {
      console.error("Failed to update habit:", error);
      // Handle error (e.g., show toast notification)
    }
  };

  if (habitDataLoading) {
    return (
      <div className="p-6 h-full">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="pt-6 h-full">
      {habitData && (
        <HabitForm
          type="Update"
          habit={habitData}
          xp={xp}
          projectedXp={projectedXp}
          submitting={submitting}
          onSubmit={handleUpdateHabit}
        />
      )}
    </div>
  );
}
