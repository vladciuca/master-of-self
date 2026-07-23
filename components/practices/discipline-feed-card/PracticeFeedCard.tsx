import React, { useState } from "react";
import { PracticeCard } from "../PracticeCard";
import { PracticeCreator } from "../PracticeCreator";
import { IconRenderer } from "@components/IconRenderer";
import { Button } from "@components/ui/button";
import { stepIconMap } from "@components/ui/constants";
import { useUserProfile } from "@context/UserProfileContext";
import { CircleCheck, Plus, Loader2 } from "lucide-react";
import type { JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

type Step = JournalCustomStepConfig | Practice;

type PracticeFeedCardProps = {
  step: Step;
  showTypeIcon?: boolean;
};

function DayNightIcon({ type }: { type?: string }) {
  const isDay = type === "dayEntry";
  return (
    <IconRenderer
      iconName={isDay ? stepIconMap.day : stepIconMap.night}
      className={isDay ? "text-journal-day" : "text-journal-night"}
      size={18}
    />
  );
}

export function PracticeFeedCard({ step, showTypeIcon = true }: PracticeFeedCardProps) {
  const { updateActivePractice, updatePracticesValues, userProfile } =
    useUserProfile();
  const [isAdding, setIsAdding] = useState(false);

  const stepId = String(step._id);
  const isPracticeAdded = Boolean(
    userProfile.practices && stepId in userProfile.practices
  );

  const handleAddPractice = async () => {
    if (isPracticeAdded || isAdding) return;

    setIsAdding(true);
    try {
      const addResult = await updatePracticesValues({ [stepId]: 0 });
      if (addResult?.success) {
        await updateActivePractice(stepId, true);
      }
    } catch (error) {
      console.error("Error adding practice:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <PracticeCard
      step={step}
      disciplineIcon={showTypeIcon ? <DayNightIcon type={step.type} /> : undefined}
      action={
        isPracticeAdded ? (
          <CircleCheck
            className="text-green-500"
            size={28}
            strokeWidth={2}
          />
        ) : (
          <Button
            variant="default"
            size="icon"
            className="rounded-full h-7 w-7"
            aria-label="Add practice"
            disabled={isAdding}
            onClick={handleAddPractice}
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            )}
          </Button>
        )
      }
      expandedContent={
        step?.creatorId
          ? <PracticeCreator creatorId={String(step.creatorId)} />
          : undefined
      }
    />
  );
}
