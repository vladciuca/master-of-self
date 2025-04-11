"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { stepIconMap } from "@components/ui/constants";
import { cn } from "@lib/utils";
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
  //NOTE: so the buttons do not appear on other peoples habit cards
  if (session?.user?.id !== habit.creatorId) {
    return null;
  }

  const IconElement = stepIconMap.habits;

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
        disabled={entryLoading || submittingJournalEntry}
        onClick={() => handleActionUpdate(habit._id)}
        className="flex-1 w-full"
      >
        Take Action
        {React.cloneElement(IconElement as React.ReactElement, {
          className: cn("ml-2"),
          size: 20,
        })}
      </Button>
    </div>
  );
}
