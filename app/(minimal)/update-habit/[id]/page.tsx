"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { calculateHabitsXpFromEntry } from "@lib/level";

export default function UpdateHabit() {
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<HabitZodType | null>(null);
  // const [habitDataLoading, setHabitDataLoading] = useState(true); // Default to true since we're loading by default
  const [isLoading, setIsLoading] = useState(true);
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  //get projected xp for habit
  const getProjectedHabitXp = (habitId: string) => {
    if (todayEntryLoading || !todayEntry) return 0;

    const dailyWillpower = todayEntry?.dailyWillpower || 0;
    const bonusWillpower = todayEntry?.bonusWillpower || 0;
    const totalWillpower = dailyWillpower + bonusWillpower;
    const habitActionsValue = todayEntry?.habits || {};

    //NOTE* should add param object here for calculateHabitsXpFromEntry util function
    const xpSums = calculateHabitsXpFromEntry(
      habitActionsValue,
      totalWillpower
    );

    return xpSums[habitId] || 0;
  };

  useEffect(() => {
    const getHabitData = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    if (id) getHabitData();
  }, [id]);

  const isPageLoading = isLoading || todayEntryLoading;

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

  if (isPageLoading) {
    return (
      <div className="p-6 h-full">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="pt-6 h-full">
      {
        habitData && (
          <HabitForm
            type="Update"
            habit={habitData}
            projectedXp={getProjectedHabitXp(id)}
            submitting={submitting}
            onSubmit={updateHabit}
          />
        )
        // : (
        //   <div className="text-center p-6">
        //     <p>Habit not found or error loading data.</p>
        //   </div>
        // )}
      }
    </div>
  );
}
