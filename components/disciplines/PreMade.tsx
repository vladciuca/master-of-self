"use client";

import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

export function PreMade({ onboarding }: { onboarding?: boolean }) {
  return (
    <>
      <Accordion
        type="single"
        collapsible
        defaultValue={
          onboarding ? customStepConfigs[0]?._id?.toString() : undefined
        }
      >
        {customStepConfigs.map((discipline) => (
          <DisciplineFeedCard key={String(discipline._id)} step={discipline} />
        ))}
      </Accordion>
    </>
  );
}
