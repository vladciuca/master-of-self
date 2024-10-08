"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { HabitCardDescription } from "@components/habits/habit-card/HabitCardDescription";
import { HabitCardActions } from "@components/habits/habit-card/HabitCardActions";
import { HabitCardFooter } from "./HabitCardFooter";
import { UpdateHabitActionsModal } from "@components/habits/habit-actions/UpdateHabitActionsModal";
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
};

export function HabitCard({
  habit,
  handleEdit,
}: //  handleDelete
HabitCardProps) {
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  const { data: session } = useSession() as { data: Session | null };
  const pathName = usePathname();

  const handleOpenChange = (open: boolean) => {
    setIsActionDrawerOpen(open);
  };

  const handleOpenHabitActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenChange(true);
  };

  return (
    <>
      <AccordionItem value={habit._id} className="my-4 p-0">
        <AccordionTrigger className="p-0 m-0 rounded-md flex flex-col">
          <HabitCardHeader
            habit={habit}
            handleOpenHabitActions={handleOpenHabitActions}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <HabitCardDescription description={habit.description} />
          <HabitCardActions actions={habit.actions} />
          <HabitCardFooter
            session={session}
            habit={habit}
            pathName={pathName}
            handleEdit={handleEdit}
            // handleDelete={handleDelete}
          />
        </AccordionContent>
      </AccordionItem>
      <UpdateHabitActionsModal
        isOpen={isActionDrawerOpen}
        onOpenChange={handleOpenChange}
        habit={habit}
      />
    </>
  );
}
