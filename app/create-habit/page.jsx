"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import HabitForm from "@components/HabitForm";

const CreateHabit = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [habit, setHabit] = useState({
    name: "",
    description: "",
    categories: [],
  });

  const createHabit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/habit/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
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
      type="Create"
      habit={habit}
      setHabit={setHabit}
      submitting={submitting}
      handleSubmit={createHabit}
    />
  );
};

export default CreateHabit;
