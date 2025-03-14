"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/useLastJournalEntry";
import { calculateHabitsXpFromEntry } from "@lib/level";

export default function UpdateHabit() {
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<HabitZodType | null>(null);
  const [habitDataLoading, setHabitDataLoading] = useState(true);
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const { lastEntry, lastEntryLoading } = useLastJournalEntry();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const habitDefaultXpValues = (habitData: HabitZodType) => {
    return habitData?.actions.reduce(
      (sum: number, action) =>
        sum + (action.type === "break" ? action.dailyTarget : 0),
      0
    );
  };

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

  useEffect(() => {
    const getHabitData = async () => {
      try {
        setHabitDataLoading(true);
        const response = await fetch(`/api/habit/${id}`);
        const data = await response.json();
        setHabitData({
          name: data.name,
          icon: data.icon,
          actions: data.actions,
          xp: data.xp,
        });
      } catch (error) {
        console.error("Error fetching habit data", error);
      } finally {
        setHabitDataLoading(false);
      }
    };

    if (id) getHabitData();
  }, [id]);

  const updateHabit = async (habit: HabitZodType) => {
    const { name, icon, actions } = habit;

    setSubmitting(true);

    if (!id) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name,
          icon: icon,
          actions: actions,
        }),
      });

      if (response.ok) {
        router.push("/habits");
      }
    } catch (error) {
      //NOTE: no console logs
      console.log(error);
    } finally {
      setSubmitting(false);
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
          onSubmit={updateHabit}
        />
      )}
    </div>
  );
}
