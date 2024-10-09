"use client";

// import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { HabitCardDescription } from "@components/habits/habit-card/HabitCardDescription";
import { HabitCardActions } from "@components/habits/habit-card/HabitCardActions";
import { HabitCardFooter } from "./HabitCardFooter";
// import { HabitActionsUpdateModal } from "@components/habits/habit-actions/HabitActionsUpdateModal";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
// import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { Session, Habit } from "@app/types/types";

type HabitCardProps = {
  habit: Habit;
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  actionUpdateValues: {
    [key: string]: number;
  };
  todayEntryLoading: boolean;
  handleActionUpdate: () => void;
};

export function HabitCard({
  habit,
  handleEdit,
  actionUpdateValues,
  todayEntryLoading,
  handleActionUpdate,
}: //  handleDelete
HabitCardProps) {
  const { description, actions, _id: habitId } = habit;

  // const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  // const handleOpenChange = (open: boolean) => {
  //   setIsActionDrawerOpen(open);
  // };

  // const handleOpenHabitActions = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   handleOpenChange(true);
  // };

  return (
    <>
      <AccordionItem value={habitId} className="my-4 p-0">
        <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
          <HabitCardHeader
            habit={habit}
            // handleOpenHabitActions={handleOpenHabitActions}
            actionUpdateValues={actionUpdateValues}
            todayEntryLoading={todayEntryLoading}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <HabitCardDescription description={description} />
          <HabitCardActions
            actions={actions}
            actionUpdateValues={actionUpdateValues}
          />
          <HabitCardFooter
            session={session}
            habit={habit}
            pathName={pathName}
            handleEdit={handleEdit}
            handleActionUpdate={handleActionUpdate}
            todayEntryLoading={todayEntryLoading}
            // handleDelete={handleDelete}
          />
        </AccordionContent>
      </AccordionItem>
      {/* <HabitActionsUpdateModal
        isOpen={isActionDrawerOpen}
        onOpenChange={handleOpenChange}
        habit={habit}
      /> */}
    </>
  );
}
