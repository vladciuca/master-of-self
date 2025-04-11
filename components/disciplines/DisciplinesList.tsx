import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { DisciplineCard } from "@components/disciplines/discipline-card/DisciplineCard";
import { DisciplineCardDescription } from "@components/disciplines/discipline-card/DisciplineCardDescription";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DisciplinesList() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 px-2"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCard discipline="motivation" />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardDescription
            title={"title"}
            description={"description"}
          />
        </AccordionContent>
      </AccordionItem>

      <DisciplineSectionDelimiter day={true} activeSteps={0} maxSteps={2} />

      {customStepConfigs
        .filter((step) => step.type === "dayEntry")
        .map((step) => {
          return (
            <AccordionItem
              key={step.discipline}
              value={step.discipline}
              className="p-0 px-2 mb-3"
            >
              <AccordionTrigger className="pt-5 pb-3">
                <DisciplineCard
                  icon={step.icon}
                  discipline={step.discipline}
                  type={step.type}
                />
              </AccordionTrigger>
              <AccordionContent>
                <DisciplineCardDescription
                  title={step.title}
                  description={step.description}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}

      <DisciplineSectionDelimiter day={false} activeSteps={0} maxSteps={2} />

      {customStepConfigs
        .filter((step) => step.type === "nightEntry")
        .map((step) => {
          return (
            <AccordionItem
              key={step.discipline}
              value={step.discipline}
              className="p-0 px-2 mb-3"
            >
              <AccordionTrigger className="pt-5 pb-3">
                <DisciplineCard
                  icon={step.icon}
                  discipline={step.discipline}
                  type={step.type}
                />
              </AccordionTrigger>
              <AccordionContent>
                <DisciplineCardDescription
                  title={step.title}
                  description={step.description}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
    </Accordion>
  );
}
