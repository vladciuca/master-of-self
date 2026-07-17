"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { PracticeCardHeader } from "./PracticeCardHeader";
import { PracticeCardContent } from "./PracticeCardContent";
import { PracticeCardFooter } from "./PracticeCardFooter";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import type { User, JournalCustomStepConfig } from "@models/types";
import type { Practice } from "@models/mongodb";

type Step = JournalCustomStepConfig | Practice;

type PracticeCardProps = {
  step: Step;
  handleEdit: (practice: Practice) => void;
};

function isUserPractice(step: Step): step is Practice {
  return "creatorId" in step;
}

export function PracticeCard({ step, handleEdit }: PracticeCardProps) {
  const { user } = useUser() as { user: User | null };
  const pathName = usePathname();

  return (
    <AccordionItem
      key={String(step._id)}
      value={String(step._id)}
      className="p-0 mb-0 border-transparent"
    >
      <IndicatorAccordionTrigger className="pt-2 pb-0">
        <PracticeCardHeader
          practiceId={String(step._id)}
          icon={step.icon}
          disciplineName={step.discipline}
          type={step.type}
          color={"color" in step ? step.color : undefined}
        />
      </IndicatorAccordionTrigger>
      <AccordionContent>
        <PracticeCardContent
          title={step.title}
          description={step.description}
        />
        {isUserPractice(step) && (
          <PracticeCardFooter
            user={user}
            pathName={pathName}
            handleEdit={handleEdit}
            practice={step}
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
