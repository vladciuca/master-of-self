"use client";

import { useRouter } from "next/navigation";
// import { HabitForm } from "@components/habits/habit-form/HabitForm";
// import { HabitForm } from "@components/habits/habit-form/HabitForm";
import { DisciplineForm } from "@components/disciplines/discipline-form/DisciplineForm";
import { DisciplineZodType } from "@models/disciplineFormSchema";
// import { useCreateHabit } from "@hooks/habits/useCreateHabit";
import { useCreateDiscipline } from "@hooks/disciplines/useCreateDiscipline";

export default function CreateDiscipline() {
  const router = useRouter();
  const { createDiscipline, submittingDiscipline, createDisciplineError } =
    useCreateDiscipline();

  // NOTE: handle navigation
  const handleCreateDiscipline = async (discipline: DisciplineZodType) => {
    try {
      await createDiscipline(discipline);
      //NOTE: use constants for these
      router.push("/profile?page=disciplines");
    } catch (error) {
      // Error is already handled in the hook
      console.error(
        "Failed to create new journal entry:",
        createDisciplineError
      );
      // Could add additional UI feedback here if needed
    }
  };

  return (
    <div className="pt-6 h-full">
      <DisciplineForm
        type="Create"
        submitting={submittingDiscipline}
        onSubmit={handleCreateDiscipline}
      />
    </div>
  );
}
