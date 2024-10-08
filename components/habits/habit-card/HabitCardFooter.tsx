"use client";

// import { useState } from "react";
import { Session, Habit } from "@app/types/types";
import { Button } from "@components/ui/button";
import { GiPencilRuler } from "react-icons/gi";
// import { FaExclamation } from "react-icons/fa";
// import { UpdateHabitActionsModal } from "@components/habits/habit-actions/UpdateHabitActionsModal";

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
  // const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  // const handleOpenChange = (open: boolean) => {
  //   setIsActionDrawerOpen(open);
  // };

  if (session?.user?.id !== habit.creatorId || pathName !== "/habits") {
    return null;
  }

  return (
    <>
      <div className="mt-12 flex justify-between">
        <Button
          variant="secondary"
          onClick={() => handleEdit(habit)}
          className="mr-3"
        >
          Update
          <GiPencilRuler className="ml-2" size={"1.2rem"} />
        </Button>
        {/* <Button
          size="sm"
          // onClick={() => setIsActionDrawerOpen(true)}
        >
          Take Action
          <FaExclamation size={"1.2rem"} />
        </Button> */}
      </div>
      {/* <UpdateHabitActionsModal
        isOpen={isActionDrawerOpen}
        onOpenChange={handleOpenChange}
        habit={habit}
      /> */}
    </>
  );
}
