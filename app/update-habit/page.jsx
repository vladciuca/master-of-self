"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import HabitForm from "@components/HabitForm";

const EditHabit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const habitId = searchParams.get("id");

  const [submitting, setSubmitting] = useState(false);
  const [habit, setHabit] = useState({
    name: "",
    description: "",
    categories: [],
  });

  useEffect(() => {
    const getHabitDetails = async () => {
      const response = await fetch(`api/habit/${habitId}`);
      const data = await response.json();
      setHabit({
        name: data.name,
        description: data.description,
        categories: data.categories,
      });
    };

    if (habitId) getHabitDetails();
  }, [habitId]);

  const updateHabit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!habitId) return alert("Habit ID not found");

    try {
      const response = await fetch(`/api/habit/${habitId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: habit.name,
          description: habit.description,
          categories: habit.categories,
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
    <HabitForm
      type="Edit"
      habit={habit}
      setHabit={setHabit}
      submitting={submitting}
      handleSubmit={updateHabit}
    />
  );
};

export default EditHabit;
