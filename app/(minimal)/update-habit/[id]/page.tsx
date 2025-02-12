"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { calculateHabitsXpFromEntry } from "@lib/level";

export default function UpdateHabit() {
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<HabitZodType | null>(null);
  const [habitDataLoading, setHabitDataLoading] = useState(true); // Default to true since we're loading by default
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  //get projected xp for habit
  const getProjectedHabitXp = (habitId: string) => {
    if (todayEntryLoading) return 0;

    const dailyWillpower = todayEntry?.dailyWillpower || 0;
    const habitActionsValue = todayEntry?.nightEntry?.actions || {};

    const xpSums = calculateHabitsXpFromEntry(
      habitActionsValue,
      dailyWillpower
    );

    return xpSums[habitId] || 0;
  };

  useEffect(() => {
    const getHabitData = async () => {
      try {
        setHabitDataLoading(true);
        const response = await fetch(`/api/habit/${id}`);
        const data = await response.json();
        setHabitData({
          name: data.name,
          icon: data.icon,
          description: data.description,
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
    const { name, icon, description, actions } = habit;

    setSubmitting(true);

    if (!id) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name,
          icon: icon,
          description: description,
          actions: actions,
        }),
      });

      if (response.ok) {
        router.push("/habits");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (todayEntryLoading || habitDataLoading) {
    return (
      <div className="p-6 h-full">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      {habitData && (
        <HabitForm
          type="Update"
          habit={habitData}
          projectedXp={getProjectedHabitXp(id)}
          submitting={submitting}
          onSubmit={updateHabit}
        />
      )}
    </div>
  );
}
