"use client";

import { useRouter, useParams } from "next/navigation";
import { PracticeForm } from "@components/practices/discipline-form/PracticeForm";
import { PracticeZodType } from "@models/practiceFormSchema";
import { SkeletonForm } from "@components/skeletons/SkeletonForm";
import { useFetchAndUpdatePractice } from "@hooks/practices/useFetchAndUpdatePractice";

export default function UpdatePractice() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const {
    practiceData,
    practiceDataLoading,
    practiceDataError,
    updatePractice,
    submittingPracticeUpdate,
  } = useFetchAndUpdatePractice(id);

  const handleUpdatePractice = async (practice: PracticeZodType) => {
    try {
      await updatePractice(practice);
      //NOTE: use constants for these
      router.push("/profile?page=practices");
    } catch (error) {
      console.error("Failed to update practice:", error);
      // Handle error (e.g., show toast notification)
    }
  };

  if (practiceDataLoading) {
    return (
      <div className="p-6 h-full">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <div className="pt-6 h-full">
      {practiceData && (
        <PracticeForm
          type="Update"
          practice={practiceData}
          submitting={submittingPracticeUpdate}
          onSubmit={handleUpdatePractice}
        />
      )}
    </div>
  );
}
