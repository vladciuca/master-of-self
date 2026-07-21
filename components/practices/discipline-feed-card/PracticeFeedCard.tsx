import React from "react";
import { PracticeCard } from "../PracticeCard";
import { PracticeFeedFooter } from "./PracticeFeedFooter";
import { PracticeCreator } from "../PracticeCreator";
import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";
import { useUserProfile } from "@context/UserProfileContext";
import { CircleCheck } from "lucide-react";
import type { JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

type Step = JournalCustomStepConfig | Practice;

type PracticeFeedCardProps = {
  step: Step;
};

function DayNightIcon({ type }: { type?: string }) {
  const isDay = type === "dayEntry";
  return (
    <IconRenderer
      iconName={isDay ? stepIconMap.day : stepIconMap.night}
      className={isDay ? `text-${JOURNAL_COLORS.day}` : `text-${JOURNAL_COLORS.night}`}
      size={18}
    />
  );
}

export function PracticeFeedCard({ step }: PracticeFeedCardProps) {
  const { userProfile } = useUserProfile();

  const stepId = String(step._id);
  const isPracticeAdded = Boolean(
    userProfile.practices && stepId in userProfile.practices
  );

  return (
    <PracticeCard
      step={step}
      disciplineIcon={<DayNightIcon type={step.type} />}
      action={
        isPracticeAdded ? (
          <CircleCheck
            className="text-green-500"
            size={22}
            strokeWidth={2.5}
          />
        ) : undefined
      }
      footer={<PracticeFeedFooter stepId={stepId} />}
      expandedContent={
        step?.creatorId
          ? <PracticeCreator creatorId={String(step.creatorId)} />
          : undefined
      }
    />
  );
}
