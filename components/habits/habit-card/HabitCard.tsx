"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { HabitCardDescription } from "@components/habits/habit-card/HabitCardDescription";
import { HabitCardActions } from "@components/habits/habit-card/HabitCardActions";
import { HabitCardFooter } from "./HabitCardFooter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Session, Habit, ActionItem } from "@app/types/types";

type HabitCardProps = {
  habit: Habit;
  entryLoading: boolean;
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  habitActionValues: ActionItem;
  lastEntryWillpower: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
};

export function HabitCard({
  habit,
  handleEdit,
  entryLoading,
  habitActionValues,
  lastEntryWillpower,
  handleActionUpdate,
  submittingJournalEntry,
}: HabitCardProps) {
  const { description, actions, _id: habitId } = habit;

  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <>
      <AccordionItem value={habitId} className="my-4 p-0">
        <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
          <HabitCardHeader
            habit={habit}
            habitActionValues={habitActionValues}
            lastEntryWillpower={lastEntryWillpower}
            entryLoading={entryLoading}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <HabitCardDescription description={description} />
          <HabitCardActions
            actions={actions}
            habitActionValues={habitActionValues}
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
