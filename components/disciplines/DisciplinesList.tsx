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
import type { JournalCustomStep, JournalCustomStepConfig } from "@models/types";

type DisciplinesListProps = {
  disciplineList: JournalCustomStepConfig[] | Discipline[];
  activeDisciplineList: JournalCustomStep[] | Discipline[];
  handleEdit: (habit: Discipline) => void;
};

export function DisciplinesList({
  disciplineList,
  activeDisciplineList,
  handleEdit,
}: DisciplinesListProps) {
  // Get day and night entries separately
  const dayEntries = disciplineList.filter((step) => step.type === "dayEntry");
  const nightEntries = disciplineList.filter(
    (step) => step.type === "nightEntry"
  );

  const dayEntryCount = activeDisciplineList.filter(
    (item) => item.type === "dayEntry"
  ).length;
  const nightEntryCount = activeDisciplineList.filter(
    (item) => item.type === "nightEntry"
  ).length;

  return (
    <Accordion type="single" collapsible>
      {/* WTF DO I DO WITH THIS? create a separate object for this?*/}

      <AccordionItem
        key={"new-discipline"}
        value={"new-discipline"}
        className="p-0 px-2 mb-3"
      >
        <AccordionTrigger className="pt-4 pb-2">
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

      <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 px-2 mb-3"
      >
        <AccordionTrigger className="pt-4 pb-2">
          <DisciplineCardHeader
            discipline="motivation"
            disciplineId="motivation"
            icon={"IoAccessibility"}
          />
        </AccordionTrigger>
        <AccordionContent>
          <DisciplineCardContent title={"title"} description={"description"} />
        </AccordionContent>
      </AccordionItem>

      {dayEntries.length !== 0 && (
        <DisciplineSectionDelimiter
          day={true}
          activeSteps={dayEntryCount}
          maxSteps={dayEntries.length}
        />
      )}

      {dayEntries.map((step) => {
        return (
          <DisciplineCard
            key={String(step._id)}
            step={step}
            handleEdit={handleEdit}
          />
        );
      })}

      {nightEntries.length !== 0 && (
        <DisciplineSectionDelimiter
          day={false}
          activeSteps={nightEntryCount}
          maxSteps={nightEntries.length}
        />
      )}

      {nightEntries.map((step) => {
        return (
          <DisciplineCard
            key={String(step._id)}
            step={step}
            handleEdit={handleEdit}
          />
        );
      })}
    </Accordion>
  );
}
