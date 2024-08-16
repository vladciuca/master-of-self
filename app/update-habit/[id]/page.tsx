"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import SkillForm from "@components/SkillForm";
import { Habit } from "@components/SkillForm";
import SkeletonForm from "@components/SkeletonForm";

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
        skillName: data.name,
        skillIcon: data.icon,
        skillDescription: data.description,
      });
    };
    if (id) getHabitData();
  }, [id]);

  const updateHabit = async (habit: Habit) => {
    const { skillName, skillIcon, skillDescription } = habit;

    setSubmitting(true);

    if (!id) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: skillName,
          icon: skillIcon,
          description: skillDescription,
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
    <SkillForm
      type="Edit"
      habit={habitData}
      submitting={submitting}
      onSubmit={updateHabit}
    />
  ) : (
    <SkeletonForm />
  );
};

export default EditHabit;
