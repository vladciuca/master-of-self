import { PracticeCardHeader } from "@components/practices/discipline-card/PracticeCardHeader";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";

export function NewPracticeCard({ onboarding }: { onboarding?: boolean }) {
  return (
    <AccordionItem
      key={"new-discipline"}
      value={"new-discipline"}
      className="p-0 mb-0 border-transparent"
    >
      <IndicatorAccordionTrigger className="pt-2 pb-0">
        <PracticeCardHeader
          disciplineName="New Practice"
          practiceId="new-discipline"
          icon={"FaPersonCircleQuestion"}
          color={"primary"}
          addNew
          onboarding={onboarding}
        />
      </IndicatorAccordionTrigger>
      <AccordionContent>
        <div className="mt-2 px-1">
          <div className="mb-4">
            Practices are personal routines or internal qualities you want to
            develop.
          </div>

          <div>
            <div className="mb-4">
              To create a Practice, think about a prompt you'd like to reflect
              on daily, and provide a short guideline or mindset for considering
              it.
            </div>

            <div className="mb-4">
              You can respond daily to these prompts in a structured,
              bullet-point format to build self-awareness and clarity. Every
              response helps you grow and earns you Willpower.
            </div>
            <div className="mb-4">
              Certain practices can be set for morning (for discipline and
              direction) or evening (for reflection and planning). The more you
              engage, the more your practice rank increases.
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
