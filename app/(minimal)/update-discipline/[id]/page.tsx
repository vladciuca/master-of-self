"use client";

import { useRouter, useParams } from "next/navigation";
import { DisciplineForm } from "@components/disciplines/discipline-form/DisciplineForm";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useFetchAndUpdateDiscipline } from "@hooks/disciplines/useFetchAndUpdateDiscipline";

export default function UpdateHabit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const {
    disciplineData,
    disciplineDataLoading,
    disciplineDataError,
    updateDiscipline,
    submittingDisciplineUpdate,
  } = useFetchAndUpdateDiscipline(id);

  const handleUpdateDiscipline = async (discipline: DisciplineZodType) => {
    try {
      await updateDiscipline(discipline);
      //NOTE: use constants for these
      router.push("/profile?page=disciplines");
    } catch (error) {
      console.error("Failed to update discipline:", error);
      // Handle error (e.g., show toast notification)
    }
  };

  if (disciplineDataLoading) {
    return (
      <div className="p-6 h-full">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="pt-6 h-full">
      {disciplineData && (
        <DisciplineForm
          type="Update"
          discipline={disciplineData}
          submitting={submittingDisciplineUpdate}
          onSubmit={handleUpdateDiscipline}
        />
      )}
    </div>
  );
}
