import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { Accordion } from "@/components/ui/accordion";
import { NewDisciplineCard } from "@components/disciplines/discipline-card/pre-made/NewDisciplineCard";
import { MotivationCard } from "@components/disciplines/discipline-card/pre-made/MotivationCard";
import { DisciplineCard } from "./discipline-card/DisciplineCard";
import { Discipline } from "@models/mongodb";
import type { JournalCustomStep, JournalCustomStepConfig } from "@models/types";

type DisciplinesListProps = {
  disciplineList: JournalCustomStepConfig[] | Discipline[];
  activeDisciplineList: JournalCustomStep[] | Discipline[];
  handleEdit: (habit: Discipline) => void;
  onboarding?: boolean;
};

export function DisciplinesList({
  disciplineList,
  activeDisciplineList,
  handleEdit,
  onboarding = false,
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
    <Accordion
      type="single"
      collapsible
      className={onboarding ? "mt-8 sm:mt-16" : ""}
    >
      <NewDisciplineCard onboarding={onboarding} />
      <MotivationCard />
      {dayEntries.length === 0 && nightEntries.length === 0 ? (
        <div className="text-center text-muted-foreground p-4 pt-8">
          You don't have any disciplines yet. Start by adding one!
        </div>
      ) : (
        <>
          {dayEntries.length !== 0 && (
            <DisciplineSectionDelimiter
              day={true}
              activeSteps={dayEntryCount}
              maxSteps={dayEntries.length}
            />
          )}

          {dayEntries.map((step) => (
            <DisciplineCard
              key={String(step._id)}
              step={step}
              handleEdit={handleEdit}
            />
          ))}

          {nightEntries.length !== 0 && (
            <DisciplineSectionDelimiter
              day={false}
              activeSteps={nightEntryCount}
              maxSteps={nightEntries.length}
            />
          )}

          {nightEntries.map((step) => (
            <DisciplineCard
              key={String(step._id)}
              step={step}
              handleEdit={handleEdit}
            />
          ))}
        </>
      )}
    </Accordion>
  );
}
