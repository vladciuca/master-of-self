import { DisciplineSectionDelimiter } from "@components/disciplines/DisciplineSectionDelimiter";
import { DisciplineCardHeader } from "@components/disciplines/discipline-card/DisciplineCardHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { DisciplineCard } from "./discipline-card/DisciplineCard";
import { Discipline } from "@models/mongodb";
import type { JournalCustomStep, JournalCustomStepConfig } from "@models/types";

import { getJournalStepStyle } from "@components/ui/constants";

import { TbChevronCompactDown } from "react-icons/tb";
import { JOURNAL_COLORS } from "@lib/colors";

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
      <AccordionItem
        key={"new-discipline"}
        value={"new-discipline"}
        className="p-0 mb-0 border-transparent"
      >
        <AccordionTrigger className="pt-2 pb-0 [&[data-state=open]>div>div:last-child>svg]:rotate-180">
          <div className="flex flex-col w-full">
            <DisciplineCardHeader
              discipline="New Discipline"
              disciplineId="new-discipline"
              icon={"FaPersonCircleQuestion"}
              color={"muted-foreground"}
              addNew
            />
            <div className="flex justify-center mt-1">
              <TbChevronCompactDown className="h-4 w-8 transition-transform duration-200 ease-in-out" />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-2 px-1">
            <div className="mb-4">
              Disciplines are personal traits or internal qualities you want to
              develop.
            </div>

            <div>
              <div className="mb-4">
                To create a Discipline, write a prompt you'd like to reflect on
                daily, and provide a short guideline or mindset for considering
                it.
              </div>

              <div className="mb-4">
                You can respond daily to these prompts in a structured,
                bullet-point format to build self-awareness and clarity. Every
                response helps you grow and earns you Willpower.
              </div>
              <div className="mb-4">
                Certain disciplines can be set for morning (for motivation and
                direction) or evening (for reflection and planning). The more
                you engage, the more your discipline rank increases.
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      {/* WTF DO I DO WITH THIS? create a separate object for this?*/}
      <AccordionItem
        key={"motivation"}
        value={"motivation"}
        className="p-0 mb-0 border-transparent"
      >
        <AccordionTrigger className="pt-2 pb-0 [&[data-state=open]>div>div:last-child>svg]:rotate-180">
          <div className="flex flex-col w-full">
            <DisciplineCardHeader
              discipline="motivation"
              disciplineId="motivation"
              icon={"IoAccessibility"}
            />
            <div className="flex justify-center mt-1">
              <TbChevronCompactDown className="h-4 w-8 transition-transform duration-200 ease-in-out" />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-2 px-1">
            <div className="mb-4">
              Motivation is the base discipline that can be engaged during both
              morning and evening.
            </div>

            <div>
              <div className="mb-4">
                It is composed of 3 daily steps, allowing you to plan your day
                and reflect on the outcome.
              </div>

              <ul className="mb-4 ml-2">
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
