"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PracticeForm } from "@components/practices/discipline-form/PracticeForm";
import { PracticeZodType } from "@models/practiceFormSchema";
import { useCreatePractice } from "@hooks/practices/useCreatePractice";

export default function CreatePractice() {
  const router = useRouter();
  const { createPractice, submittingPractice, createPracticeError } =
    useCreatePractice();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCreatePractice = async (practice: PracticeZodType) => {
    if (submittingPractice || isNavigating) return;

    setIsNavigating(true);

    try {
      await createPractice(practice);
      router.push("/settings?page=Practices");
    } catch (error) {
      setIsNavigating(false);
      console.error(
        "Failed to create new practice:",
        createPracticeError
      );
    }
  };

  return (
    <div className="pt-6 h-full">
      <PracticeForm
        type="Create"
        submitting={submittingPractice || isNavigating}
        onSubmit={handleCreatePractice}
      />
    </div>
  );
}
