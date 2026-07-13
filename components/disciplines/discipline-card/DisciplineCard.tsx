"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { DisciplineCardHeader } from "./DisciplineCardHeader";
import { DisciplineCardContent } from "./DisciplineCardContent";
import { DisciplineCardFooter } from "./DisciplineCardFooter";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import type { User, JournalCustomStepConfig } from "@models/types";
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
  const { user } = useUser() as { user: User | null };
  const pathName = usePathname();

  return (
    <AccordionItem
      key={String(step._id)}
      value={String(step._id)}
      className="p-0 mb-0 border-transparent"
    >
      <IndicatorAccordionTrigger className="pt-2 pb-0">
        <DisciplineCardHeader
          disciplineId={String(step._id)}
          icon={step.icon}
          discipline={step.discipline}
          type={step.type}
          color={"color" in step ? step.color : undefined}
        />
      </IndicatorAccordionTrigger>
      <AccordionContent>
        <DisciplineCardContent
          title={step.title}
          description={step.description}
        />
        {isUserDiscipline(step) && (
          <DisciplineCardFooter
            user={user}
            pathName={pathName}
            handleEdit={handleEdit}
            discipline={step}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
