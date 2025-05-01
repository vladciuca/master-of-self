import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DisciplineCardHeader } from "./DisciplineCardHeader";
import { DisciplineCardContent } from "./DisciplineCardContent";
import { DisciplineCardFooter } from "./DisciplineCardFooter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Session, JournalCustomStepConfig } from "@models/types";
import type { Discipline } from "@models/mongodb";

type Step = JournalCustomStepConfig | Discipline;

type DisciplineCardProps = {
  step: Step;
  handleEdit: (habit: Discipline) => void;
};

function isUserDiscipline(step: Step): step is Discipline {
  return "creatorId" in step;
}

export function DisciplineCard({ step, handleEdit }: DisciplineCardProps) {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <AccordionItem
      key={String(step._id)}
      value={String(step._id)}
      className="p-0 px-2 mb-3"
    >
      <AccordionTrigger className="pt-4 pb-2">
        <DisciplineCardHeader
          disciplineId={String(step._id)}
          icon={step.icon}
          discipline={step.discipline}
          type={step.type}
          color={"color" in step ? step.color : undefined}
        />
      </AccordionTrigger>
      <AccordionContent>
        <DisciplineCardContent
          title={step.title}
          description={step.description}
        />
        {isUserDiscipline(step) && (
          <DisciplineCardFooter
            session={session}
            pathName={pathName}
            handleEdit={handleEdit}
            discipline={step}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
