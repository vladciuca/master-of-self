"use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { useCreateHabit } from "@hooks/habits/useCreateHabit";
// import { Session } from "@models/types";

export default function CreateHabit() {
  const router = useRouter();
  // const { data: session } = useSession() as { data: Session | null };
  // const [submitting, setSubmitting] = useState<boolean>(false);
  const { createHabit, submitting, createError, isAuthenticated } =
    useCreateHabit();

  // const createHabit = async (habit: HabitZodType) => {
  //   const { name, icon, actions } = habit;
  //   setSubmitting(true);

  //   try {
  //     const response = await fetch("/api/habit/new", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         userId: session?.user?.id,
  //         name: name,
  //         icon: icon,
  //         xp: 0,
  //         actions: actions,
  //       }),
  //     });

  //     if (response.ok) {
  //       router.push("/habits");
  //     }
  //   } catch (error) {
  //     //NOTE: no console log errors
  //     console.log(error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // NOTE: handle navigation
  const handleCreateHabit = async (habit: HabitZodType) => {
    try {
      await createHabit(habit);
      router.push("/habits");
    } catch (error) {
      // Error is already handled in the hook
      // You could add additional UI feedback here if needed
    }
  };

  // Optional: Add authentication check
  // if (!isAuthenticated) {
  //   return (
  //     <div className="pt-6 h-full">
  //       <p>Please sign in to create habits</p>
  //     </div>
  //   );
  // }

  return (
    <div className="pt-6 h-full">
      <HabitForm
        type="Create"
        submitting={submitting}
        onSubmit={handleCreateHabit}
      />
    </div>
  );
}
