import React from "react";
import { PracticeCard } from "../PracticeCard";
import { PracticeFeedFooter } from "./PracticeFeedFooter";
import { PracticeCreator } from "../PracticeCreator";
import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";
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
      size={22}
    />
  );
}

export function PracticeFeedCard({ step }: PracticeFeedCardProps) {
  return (
    <PracticeCard
      step={step}
      action={<DayNightIcon type={step.type} />}
      footer={<PracticeFeedFooter stepId={String(step._id)} />}
      expandedContent={
        step?.creatorId
          ? <PracticeCreator creatorId={String(step.creatorId)} />
          : undefined
      }
    />
  );
}
