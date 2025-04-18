import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { DisciplineCardHeader } from "@components/disciplines/discipline-card/DisciplineCardHeader";
import { DisciplineCardContent } from "@components/disciplines/discipline-card/DisciplineCardContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { DisciplineCard } from "./discipline-card/DisciplineCard";
import { Discipline } from "@models/mongodb";
import type { JournalCustomStepConfig } from "@models/types";
// import { NewDisciplineCard } from "./NewDisciplineCard";

type DisciplinesListProps = {
  disciplineList: JournalCustomStepConfig[] | Discipline[];
  handleEdit: (habit: Discipline) => void;
};

export function DisciplinesList({
  disciplineList,
  handleEdit,
}: DisciplinesListProps) {
  // Get day and night entries separately
  const dayEntries = disciplineList.filter((step) => step.type === "dayEntry");
  const nightEntries = disciplineList.filter(
    (step) => step.type === "nightEntry"
  );

  return (
    <Accordion type="single" collapsible>
      {/* <NewDisciplineCard /> */}

      {/* WTF DO I DO WITH THIS? create a separate object for this?*/}
      <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 px-2"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCardHeader
            discipline="motivation"
            disciplineId="motivation"
          />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardContent title={"title"} description={"description"} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        key={"new-discipline"}
        value={"new-discipline"}
        className="p-0 px-2"
      >
        <AccordionTrigger className="pt-5 pb-3">
          <DisciplineCardHeader
            discipline="New Discipline"
            disciplineId="new-discipline"
            icon={"FaPersonCircleQuestion"}
            color={"muted-foreground"}
            addNew
          />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardContent title={"title"} description={"description"} />
        </AccordionContent>
      </AccordionItem>
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
