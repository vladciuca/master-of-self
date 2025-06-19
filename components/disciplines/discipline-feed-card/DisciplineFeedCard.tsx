import React from "react";
import { DisciplineFeedHeader } from "./DisciplineFeedHeader";
import { DisciplineFeedFooter } from "./DisciplineFeedFooter";
import { DisciplineCardContent } from "@components/disciplines/discipline-card/DisciplineCardContent";
import { DisciplineCreator } from "../discipline-card/DisciplineCreator";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { JournalCustomStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sun, Sparkles, Target, User } from "lucide-react";

type Step = JournalCustomStepConfig | Discipline;

type DisciplineCardProps = {
  step: Step;
};

export function DisciplineFeedCard({ step }: DisciplineCardProps) {
  return (
    <>
      <AccordionItem
        key={step.discipline}
        value={step.discipline}
        className="p-0 px-2 mb-3"
      >
        <AccordionTrigger className="py-4">
          <DisciplineFeedHeader
            icon={step.icon}
            discipline={step.discipline}
            title={step.title}
            type={step.type}
            color={"color" in step ? step.color : undefined}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardContent
            // title={step.title}
            description={step.description}
          />
          <DisciplineFeedFooter stepId={String(step._id)} />
          {step?.creatorId && (
            <DisciplineCreator creatorId={String(step.creatorId)} />
          )}
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
