"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";
import { Session } from "@app/types/types";

export default function CreateHabit() {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createHabit = async (habit: HabitZodType) => {
    const { name, icon, description, actions } = habit;
    setSubmitting(true);

    try {
      const response = await fetch("/api/habit/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          name: name,
          icon: icon,
          description: description,
          xp: 0,
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

  return (
    <div className="p-6 h-full">
      <HabitForm type="Create" submitting={submitting} onSubmit={createHabit} />
    </div>
  );
}
