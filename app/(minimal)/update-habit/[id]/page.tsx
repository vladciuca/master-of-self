"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { HabitForm, HabitZodType } from "@components/habits/HabitForm";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";

export default function UpdateHabit() {
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<HabitZodType | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  useEffect(() => {
    const getHabitData = async () => {
      const response = await fetch(`/api/habit/${id}`);
      const data = await response.json();
      setHabitData({
        name: data.name,
        icon: data.icon,
        description: data.description,
        xp: data.xp,
      });
    };
    if (id) getHabitData();
  }, [id]);

  const updateHabit = async (habit: HabitZodType) => {
    const { name, icon, description } = habit;

    setSubmitting(true);

    if (!id) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: name,
          icon: icon,
          description: description,
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

  return (
    <div className="p-6 h-full">
      {habitData ? (
        <HabitForm
          type="Update"
          habit={habitData}
          submitting={submitting}
          onSubmit={updateHabit}
        />
      ) : (
        <SkeletonForm />
      )}
    </div>
  );
}
