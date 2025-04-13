import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { DisciplineCard } from "@components/disciplines/discipline-card/DisciplineCard";
import { DisciplineCardDescription } from "@components/disciplines/discipline-card/DisciplineCardDescription";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { Discipline } from "@models/mongodb";

export function DisciplinesList({
  userDisciplines,
}: {
  userDisciplines: Discipline[];
}) {
  // console.log("==========userDisciplines", userDisciplines);

  const mergedDisciplines = [...customStepConfigs, ...userDisciplines];

  // console.log("=====customStepConfigs", customStepConfigs);
  // console.log("=====userDisciplines", userDisciplines);

  // Get day and night entries separately
  const dayEntries = mergedDisciplines.filter(
    (step) => step.type === "dayEntry"
  );
  const nightEntries = mergedDisciplines.filter(
    (step) => step.type === "nightEntry"
  );
  //NOTE: this might be use to render the first category of Disciplines
  //like Motivation, if we would have more
  // const otherEntries = mergedDisciplines.filter(
  //   (step) => step.type !== "dayEntry" && step.type !== "nightEntry"
  // );

  return (
    <Accordion type="single" collapsible className="mt-4">
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

      {dayEntries.map((step) => {
        return (
          <AccordionItem
            key={step.discipline}
            value={step.discipline}
            className={`p-0 px-2 mb-3 border-${step.color}`}
            // className="p-0 px-2 mb-3"
          >
            <AccordionTrigger className="pt-5 pb-3">
              <DisciplineCard
                icon={step.icon}
                discipline={step.discipline}
                type={step.type}
                // color={step.color}
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

      {nightEntries.map((step) => {
        return (
          <AccordionItem
            key={step.discipline}
            value={step.discipline}
            // className="p-0 px-2 mb-3"
            className={`p-0 px-2 mb-3 border-${step.color}`}
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
