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
import { Session, Habit } from "@app/types/types";

type HabitCardProps = {
  habit: Habit;
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  actionUpdateValues: {
    [key: string]: number;
  };
  entryLoading: boolean;
  willpowerMultiplier: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
  isNotToday: boolean;
};

export function HabitCard({
  habit,
  handleEdit,
  actionUpdateValues,
  entryLoading,
  willpowerMultiplier,
  handleActionUpdate,
  submittingJournalEntry,
  isNotToday,
}: //  handleDelete
HabitCardProps) {
  const { description, actions, _id: habitId } = habit;

  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  return (
    <>
      <AccordionItem value={habitId} className="my-4 p-0">
        <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
          <HabitCardHeader
            habit={habit}
            actionUpdateValues={actionUpdateValues}
            entryLoading={entryLoading}
            willpowerMultiplier={willpowerMultiplier}
            isNotToday={isNotToday}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <HabitCardDescription description={description} />
          <HabitCardActions
            actions={actions}
            actionUpdateValues={actionUpdateValues}
            isNotToday={isNotToday}
          />
          <HabitCardFooter
            session={session}
            habit={habit}
            pathName={pathName}
            handleEdit={handleEdit}
            handleActionUpdate={handleActionUpdate}
            entryLoading={entryLoading}
            submittingJournalEntry={submittingJournalEntry}
            // handleDelete={handleDelete}
          />
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
