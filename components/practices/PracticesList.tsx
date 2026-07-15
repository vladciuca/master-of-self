import { PracticeSectionDelimiter } from "@components/practices/PracticeSectionDelimiter";
import { Accordion } from "@/components/ui/accordion";
import { NewPracticeCard } from "@components/practices/discipline-card/pre-made/NewPracticeCard";
import { DisciplineCard as BaseDisciplineCard } from "@components/practices/discipline-card/pre-made/DisciplineCard";
import { PracticeCard } from "./discipline-card/PracticeCard";
import { Practice } from "@models/mongodb";
import type { JournalCustomStep, JournalCustomStepConfig } from "@models/types";

type PracticesListProps = {
  practiceList: JournalCustomStepConfig[] | Practice[];
  activePracticeList: JournalCustomStep[] | Practice[];
  handleEdit: (habit: Practice) => void;
  onboarding?: boolean;
};

export function PracticesList({
  practiceList,
  activePracticeList,
  handleEdit,
  onboarding = false,
}: PracticesListProps) {
  // Get day and night entries separately
  const dayEntries = practiceList.filter((step) => step.type === "dayEntry");
  const nightEntries = practiceList.filter(
    (step) => step.type === "nightEntry"
  );

  const dayEntryCount = activePracticeList.filter(
    (item) => item.type === "dayEntry"
  ).length;
  const nightEntryCount = activePracticeList.filter(
    (item) => item.type === "nightEntry"
  ).length;

  return (
    <Accordion
      type="single"
      collapsible
      className={onboarding ? "mt-8 sm:mt-16" : ""}
    >
      <NewPracticeCard onboarding={onboarding} />
      <BaseDisciplineCard />
      {dayEntries.length === 0 && nightEntries.length === 0 ? (
        <div className="text-center text-muted-foreground p-4 pt-8">
          You don't have any practices yet. Start by adding one!
        </div>
      ) : (
        <>
          {dayEntries.length !== 0 && (
            <PracticeSectionDelimiter
              day={true}
              activeSteps={dayEntryCount}
              maxSteps={dayEntries.length}
            />
          )}

          {dayEntries.map((step) => (
            <PracticeCard
              key={String(step._id)}
              step={step}
              handleEdit={handleEdit}
            />
          ))}

          {nightEntries.length !== 0 && (
            <PracticeSectionDelimiter
              day={false}
              activeSteps={nightEntryCount}
              maxSteps={nightEntries.length}
            />
          )}

          {nightEntries.map((step) => (
            <PracticeCard
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
