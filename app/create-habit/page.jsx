"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import SkillForm from "@/components/SkillForm";

const CreateHabit = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);

  const createHabit = async (value) => {
    const { skillName, skillIcon, skillDescription, skillTag } = value;
    setSubmitting(true);

    try {
      const response = await fetch("/api/habit/new", {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user.id,
          name: skillName,
          icon: skillIcon,
          description: skillDescription,
          categories: skillTag,
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
    <SkillForm type="Create" submitting={submitting} onSubmit={createHabit} />
  );
};

export default CreateHabit;
