"use client";

import { Button } from "@components/ui/button";
import { GiPencilRuler } from "react-icons/gi";
import { Session, Habit } from "@models/types";

type HabitCardFooterProps = {
  session: Session | null;
  habit: Habit;
  pathName: string;
  handleEdit: (habit: Habit) => void;
  handleActionUpdate: (habitId: string) => void;
  entryLoading: boolean;
  submittingJournalEntry: boolean;
};

export function HabitCardFooter({
  session,
  habit,
  pathName,
  handleEdit,
  handleActionUpdate,
  entryLoading,
  submittingJournalEntry,
}: HabitCardFooterProps) {
  if (session?.user?.id !== habit.creatorId || pathName !== "/habits") {
    return null;
  }

  return (
    <div className="mt-10 flex space-x-4">
      <Button
        variant="outline"
        onClick={() => handleEdit(habit)}
        className="flex-1 w-full"
      >
        Update Habit
      </Button>

      <Button
        variant="secondary"
        disabled={entryLoading && submittingJournalEntry}
        onClick={() => handleActionUpdate(habit._id)}
        className="flex-1 w-full"
      >
        Take Action
        <GiPencilRuler className="ml-2" size={"1.2rem"} />
      </Button>
    </div>
  );
}
