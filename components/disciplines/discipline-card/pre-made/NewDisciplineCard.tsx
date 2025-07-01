import { DisciplineCardHeader } from "@components/disciplines/discipline-card/DisciplineCardHeader";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";

export function NewDisciplineCard({ onboarding }: { onboarding?: boolean }) {
  return (
    <AccordionItem
      key={"new-discipline"}
      value={"new-discipline"}
      className="p-0 mb-0 border-transparent"
    >
      <IndicatorAccordionTrigger className="pt-2 pb-0">
        <DisciplineCardHeader
          discipline={"New Discipline"}
          disciplineId="new-discipline"
          icon={"FaPersonCircleQuestion"}
          color={"text-primary"}
          addNew
          onboarding={onboarding}
        />
      </IndicatorAccordionTrigger>
      <AccordionContent>
        <div className="mt-2 px-1">
          <div className="mb-4">
            Disciplines are personal traits or internal qualities you want to
            develop.
          </div>

          <div>
            <div className="mb-4">
              To create a Discipline, think about a prompt you'd like to reflect
              on daily, and provide a short guideline or mindset for considering
              it.
            </div>

            <div className="mb-4">
              You can respond daily to these prompts in a structured,
              bullet-point format to build self-awareness and clarity. Every
              response helps you grow and earns you Willpower.
            </div>
            <div className="mb-4">
              Certain disciplines can be set for morning (for motivation and
              direction) or evening (for reflection and planning). The more you
              engage, the more your discipline rank increases.
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
