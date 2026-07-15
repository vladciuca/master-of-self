import React from "react";
import { PracticeFeedHeader } from "./PracticeFeedHeader";
import { PracticeFeedFooter } from "./PracticeFeedFooter";
import { PracticeCardContent } from "../discipline-card/PracticeCardContent";
import { PracticeCreator } from "../discipline-card/PracticeCreator";
import {
  AccordionContent,
  AccordionItem,
  // AccordionTrigger,
} from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import type { JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

type Step = JournalCustomStepConfig | Practice;

type PracticeFeedCardProps = {
  step: Step;
};

export function PracticeFeedCard({ step }: PracticeFeedCardProps) {
  return (
    <>
      <AccordionItem
        key={step.discipline}
        value={step.discipline}
        className="p-0 mb-3 border-none"
      >
        <IndicatorAccordionTrigger className="py-0">
          <PracticeFeedHeader
            icon={step.icon}
            discipline={step.discipline}
            title={step.title}
            type={step.type}
            color={"color" in step ? step.color : undefined}
            stepId={String(step._id)}
          />
        </IndicatorAccordionTrigger>
        <AccordionContent>
          <PracticeCardContent
            // title={step.title}
            description={step.description}
          />
          <PracticeFeedFooter stepId={String(step._id)} />
          {step?.creatorId && (
            <PracticeCreator creatorId={String(step.creatorId)} />
          )}
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
