import React from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DisciplineCardHeader } from "./DisciplineCardHeader";
import { DisciplineCardDescription } from "./DisciplineCardDescription";
import { DisciplineCardFooter } from "./DisciplineCardFooter";
import {
  //   Accordion,
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

export function DisciplineCard({ step, handleEdit }: DisciplineCardProps) {
  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <div>
      <AccordionItem
        key={step.discipline}
        value={step.discipline}
        className="p-0 px-2 mb-3"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCardHeader
            icon={step.icon}
            discipline={step.discipline}
            type={step.type}
            // color={step.color}
            color={"color" in step ? step.color : undefined}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardDescription
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
    </div>
  );
}
