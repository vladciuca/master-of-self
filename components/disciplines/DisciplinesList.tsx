import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
// import { DisciplineCardHeader } from "@components/disciplines/discipline-card/DisciplineCardHeader";
// import { DisciplineCardDescription } from "@components/disciplines/discipline-card/DisciplineCardDescription";
import {
  Accordion,
  // AccordionContent,
  // AccordionItem,
  // AccordionTrigger,
} from "@/components/ui/accordion";

import { DisciplineCard } from "./discipline-card/DisciplineCard";
import { customStepConfigs } from "@components/journal/journal-entry-form/form-steps/steps/CustomSteps";
import { Discipline } from "@models/mongodb";

type DisciplinesListProps = {
  userDisciplines: Discipline[];
  handleEdit: (habit: Discipline) => void;
};

export function DisciplinesList({
  userDisciplines,
  handleEdit,
}: DisciplinesListProps) {
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
      {/* WTF DO I DO WITH THIS? create a separate object for this?*/}
      {/* <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 px-2"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCardHeader discipline="motivation" />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardDescription
            title={"title"}
            description={"description"}
          />
        </AccordionContent>
      </AccordionItem> */}

      <DisciplineSectionDelimiter day={true} activeSteps={0} maxSteps={2} />

      {dayEntries.map((step) => {
        return <DisciplineCard step={step} handleEdit={handleEdit} />;
      })}

      <DisciplineSectionDelimiter day={false} activeSteps={0} maxSteps={2} />

      {nightEntries.map((step) => {
        return <DisciplineCard step={step} handleEdit={handleEdit} />;
      })}
    </Accordion>
  );
}
