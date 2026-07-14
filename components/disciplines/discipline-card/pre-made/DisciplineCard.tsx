import { DisciplineCardHeader } from "@components/disciplines/discipline-card/DisciplineCardHeader";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import { JOURNAL_COLORS, DISCIPLINE_COLORS } from "@lib/colors";
import { stepIconMap } from "@components/ui/constants";

export function DisciplineCard() {
  return (
    <AccordionItem
      key={"discipline"}
      value={"discipline"}
      className="p-0 mb-0 border-transparent"
    >
      <IndicatorAccordionTrigger className="pt-2 pb-0">
        <DisciplineCardHeader
          discipline="Discipline"
          disciplineId="discipline"
          icon={stepIconMap.discipline}
          color={DISCIPLINE_COLORS.slate}
        />
      </IndicatorAccordionTrigger>
      <AccordionContent>
        <div className="mt-2 px-1">
          <div className="mb-4">
            Discipline is the base discipline that can be engaged during both
            morning and evening.
          </div>

          <div>
            <div className="mb-4">
              It is composed of 3 daily steps, allowing you to plan your day and
              reflect on the outcome.
            </div>

            <ul className="mb-4 ml-1">
              <li className="flex items-center">
                <div
                  className={`mr-2 bg-${JOURNAL_COLORS.day} w-2 h-2 rounded-full`}
                />
                What will make today great?
              </li>
              <li className="flex items-center">
                <div
                  className={`mr-2 bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)] w-2 h-2 rounded-full`}
                />
                What made today great?
              </li>
              <li className="flex items-center">
                <div
                  className={`mr-2 bg-${JOURNAL_COLORS.night} w-2 h-2 rounded-full`}
                />
                Daily Highlights
              </li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
