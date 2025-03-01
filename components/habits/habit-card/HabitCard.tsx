"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { HabitCardActions } from "@components/habits/habit-card/HabitCardActions";
import { HabitCardFooter } from "./HabitCardFooter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Session, Habit, JournalEntryHabitActions } from "@models/types";

type HabitCardProps = {
  habit: Habit;
  entryLoading: boolean;
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  habitDefaultActionValues: JournalEntryHabitActions;
  habitActionValues: JournalEntryHabitActions;
  lastEntryWillpower: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
  hasNoEntryToday: boolean;
};

export function HabitCard({
  habit,
  handleEdit,
  entryLoading,
  habitDefaultActionValues,
  habitActionValues,
  lastEntryWillpower,
  handleActionUpdate,
  submittingJournalEntry,
  hasNoEntryToday,
}: HabitCardProps) {
  const { actions, _id: habitId } = habit;

  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <>
      <AccordionItem value={habitId} className="my-4 p-0">
        <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
          <HabitCardHeader
            habit={habit}
            habitDefaultActionValues={habitDefaultActionValues}
            habitActionValues={habitActionValues}
            lastEntryWillpower={lastEntryWillpower}
            entryLoading={entryLoading}
            hasNoEntryToday={hasNoEntryToday}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <HabitCardActions
            actions={actions}
            habitDefaultActionValues={habitDefaultActionValues}
            habitActionValues={habitActionValues}
            hasNoEntryToday={hasNoEntryToday}
          />
          <HabitCardFooter
            session={session}
            habit={habit}
            pathName={pathName}
            handleEdit={handleEdit}
            // handleDelete={handleDelete}
            handleActionUpdate={handleActionUpdate}
            entryLoading={entryLoading}
            submittingJournalEntry={submittingJournalEntry}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
