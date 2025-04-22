"use client";

import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";

export function BuiltIn() {
  return (
    <>
      <Accordion type="single" collapsible className="">
        {customStepConfigs.map((discipline) => (
          <DisciplineFeedCard step={discipline} />
        ))}
      </Accordion>
    </>
  );
}
