import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DisciplineFeedHeader } from "./DisciplineFeedHeader";
import { DisciplineFeedContent } from "./DisciplineFeedContent";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Session, JournalStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

type Step = JournalStepConfig | Discipline;

type DisciplineCardProps = {
  step: Step;
  handleEdit: (habit: Discipline) => void;
};

function isUserDiscipline(step: Step): step is Discipline {
  return "creatorId" in step;
}

export function DisciplineFeedCard({ step, handleEdit }: DisciplineCardProps) {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
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
        <DisciplineFeedContent description={step.description} />
      </AccordionContent>
    </AccordionItem>
  );
}
