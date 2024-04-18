"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SkillForm from "@components/SkillForm";

const EditHabit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitId = searchParams.get("id");

  const [submitting, setSubmitting] = useState(false);
  const [habit, setHabit] = useState(null);

  useEffect(() => {
    const getHabitDetails = async () => {
      const response = await fetch(`api/habit/${habitId}`);
      const data = await response.json();

      setHabit({
        name: data.name,
        description: data.description,
      });
    };

    if (habitId) getHabitDetails();
  }, [habitId]);

  const updateHabit = async (value) => {
    const { skillName, skillDescription } = value;
    setSubmitting(true);

    if (!habitId) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${habitId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: skillName,
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

  return habit ? (
    <SkillForm
      type="Edit"
      habit={habit}
      submitting={submitting}
      onSubmit={updateHabit}
    />
  ) : (
    <div>Loading skeleton</div>
  );
};

export default EditHabit;
