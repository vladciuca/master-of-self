"use client";

import { useRouter } from "next/navigation";
import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { HabitZodType } from "@models/habitFormSchema";
import { useCreateHabit } from "@hooks/habits/useCreateHabit";

export default function CreateHabit() {
  const router = useRouter();
  const { createHabit, submittingHabit, createHabitError } = useCreateHabit();

  // NOTE: handle navigation
  const handleCreateHabit = async (habit: HabitZodType) => {
    try {
      await createHabit(habit);
      router.push("/habits");
    } catch (error) {
      // Error is already handled in the hook
      console.error("Failed to create new journal entry:", createHabitError);
      // Could add additional UI feedback here if needed
    }
  };

  return (
    <div className="pt-6 h-full">
      <HabitForm
        type="Create"
        submitting={submittingHabit}
        onSubmit={handleCreateHabit}
      />
    </div>
  );
}
