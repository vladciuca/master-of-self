"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HabitForm from "@components/HabitForm";
import { Habit } from "@components/HabitForm";

interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Session {
  user: User;
}

const CreateHabit = () => {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createHabit = async (habit: Habit) => {
    const { skillName, skillIcon, skillDescription } = habit;
    setSubmitting(true);

    try {
      const response = await fetch("/api/habit/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          name: skillName,
          icon: skillIcon,
          description: skillDescription,
          resource: 0,
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
    <HabitForm type="Create" submitting={submitting} onSubmit={createHabit} />
  );
};

export default CreateHabit;