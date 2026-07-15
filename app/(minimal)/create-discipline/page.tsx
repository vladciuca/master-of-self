"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DisciplineForm } from "@components/disciplines/discipline-form/DisciplineForm";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { useCreateDiscipline } from "@hooks/disciplines/useCreateDiscipline";

export default function CreateDiscipline() {
  const router = useRouter();
  const { createDiscipline, submittingDiscipline, createDisciplineError } =
    useCreateDiscipline();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCreateDiscipline = async (discipline: DisciplineZodType) => {
    if (submittingDiscipline || isNavigating) return;

    setIsNavigating(true);

    try {
      await createDiscipline(discipline);
      router.push("/settings?page=Practices");
    } catch (error) {
      setIsNavigating(false);
      console.error(
        "Failed to create new journal entry:",
        createDisciplineError
      );
    }
  };

  return (
    <div className="pt-6 h-full">
      <DisciplineForm
        type="Create"
        submitting={submittingDiscipline || isNavigating}
        onSubmit={handleCreateDiscipline}
      />
    </div>
  );
}
