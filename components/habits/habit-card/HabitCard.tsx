"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { HabitCardActions } from "@components/habits/habit-card/HabitCardActions";
import { HabitCardFooter } from "./HabitCardFooter";
import { AccordionContent, AccordionItem } from "@components/ui/accordion";
import { IndicatorAccordionTrigger } from "@/components/ui/indicator-accordion-trigger";
import { User, Habit, JournalEntryHabitActions } from "@models/types";

type HabitCardProps = {
  habit: Habit;
  addNew?: boolean;
  entryLoading: boolean;
  handleEdit: (habit: Habit) => void;
  habitDefaultActionValues: JournalEntryHabitActions;
  habitActionValues: JournalEntryHabitActions;
  entryTotalWillpower: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
  hasNoEntryToday: boolean;
};

export function HabitCard({
  habit,
  addNew,
  handleEdit,
  entryLoading,
  habitDefaultActionValues,
  habitActionValues,
  entryTotalWillpower,
  handleActionUpdate,
  submittingJournalEntry,
  hasNoEntryToday,
}: HabitCardProps) {
  const { actions, _id: habitId } = habit;

  const { user } = useUser() as { user: User | null };
  const pathName = usePathname();

  return (
    <>
      <AccordionItem value={habitId} className="p-0 border-none">
        <IndicatorAccordionTrigger className="p-0 m-0 rounded-md flex flex-col ">
          <HabitCardHeader
            habit={habit}
            addNew={addNew}
            habitDefaultActionValues={habitDefaultActionValues}
            habitActionValues={habitActionValues}
            entryTotalWillpower={entryTotalWillpower}
            entryLoading={entryLoading}
            hasNoEntryToday={hasNoEntryToday}
          />
        </IndicatorAccordionTrigger>
        <AccordionContent className="px-1">
          {addNew ? (
            <div>
              <div className="mb-4">
                Habits are collections of simple, repeatable actions that you
                can track daily to monitor progress in a specific area of
                personal growth or improvement.
              </div>

              <div>
                Create a habit group by adding one or more actions. You can
                update the group anytime to include additional actions as
                needed.
              </div>
            </div>
          ) : (
            <>
              <HabitCardActions
                actions={actions}
                habitDefaultActionValues={habitDefaultActionValues}
                habitActionValues={habitActionValues}
                hasNoEntryToday={hasNoEntryToday}
              />
              <HabitCardFooter
                user={user}
                habit={habit}
                pathName={pathName}
                handleEdit={handleEdit}
                handleActionUpdate={handleActionUpdate}
                entryLoading={entryLoading}
                submittingJournalEntry={submittingJournalEntry}
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
