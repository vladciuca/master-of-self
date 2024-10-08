"use client";

import { Button } from "@components/ui/button";
import { GiPencilRuler } from "react-icons/gi";
import { Session, Habit } from "@app/types/types";

type HabitCardFooterProps = {
  session: Session | null;
  habit: Habit;
  pathName: string;
  handleEdit: (habit: Habit) => void;
};

export function HabitCardFooter({
  session,
  habit,
  pathName,
  handleEdit,
}: HabitCardFooterProps) {
  if (session?.user?.id !== habit.creatorId || pathName !== "/habits") {
    return null;
  }

  return (
    <div className="mt-12 flex justify-between">
      <Button
        variant="secondary"
        onClick={() => handleEdit(habit)}
        className="mr-3"
      >
        Update
        <GiPencilRuler className="ml-2" size={"1.2rem"} />
      </Button>
    </div>
  );
}
