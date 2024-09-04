"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import HabitForm, { Habit } from "@components/habits/HabitForm";
import SkeletonForm from "@components/skeletons/SkeletonForm";

const EditHabit = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const [submitting, setSubmitting] = useState(false);
  const [habitData, setHabitData] = useState<Habit | null>(null);

  useEffect(() => {
    const getHabitData = async () => {
      const response = await fetch(`/api/habit/${id}`);
      const data = await response.json();
      setHabitData({
        name: data.name,
        icon: data.icon,
        description: data.description,
      });
    };
    if (id) getHabitData();
  }, [id]);

  const updateHabit = async (habit: Habit) => {
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

  return habitData ? (
    <HabitForm
      type="Update"
      habit={habitData}
      submitting={submitting}
      onSubmit={updateHabit}
    />
  ) : (
    <SkeletonForm />
  );
};

export default EditHabit;
