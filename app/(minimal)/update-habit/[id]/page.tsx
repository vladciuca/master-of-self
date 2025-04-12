"use client";

import { useRouter, useParams } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useFetchAndUpdateHabit } from "@hooks/habits/useFetchAndUpdateHabit";
import { getHabitXpFromEntry } from "@lib/level";

export default function UpdateHabit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const {
    habitData,
    submittingHabitUpdate,
    habitDataLoading,
    updateHabit,
    habitDefaultXpValues,
  } = useFetchAndUpdateHabit(id);

  // NOTE: Not using Error here!
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  //habit ->
  const habitDefaultXp = habitData && habitDefaultXpValues(habitData);
  //last entry ->
  const projectedHabitXp = getHabitXpFromEntry({
    entry: lastEntry,
    loading: lastEntryLoading,
    habitId: id,
  });

  //xp = xp
  // ?? nullish operator so that XP will only be 0 if habit data is null or undefined
  let xp = habitData?.xp ?? 0;
  //projected xp = projected xp
  let projectedXp = projectedHabitXp;

  //!today entry ->
  if (!todayEntry) {
    //xp = xp + projected xp
    xp = xp + projectedHabitXp;
    //projected xp = habit default xp || 0
    projectedXp = habitDefaultXp || 0;
  }

  const handleUpdateHabit = async (habit: HabitZodType) => {
    try {
      await updateHabit(habit);
      //NOTE: use constants for these
      router.push("/profile?page=habits");
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
          submitting={submittingHabitUpdate}
          onSubmit={handleUpdateHabit}
        />
      )}
    </div>
  );
}
