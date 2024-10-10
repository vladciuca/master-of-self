"use client";

// import Link from "next/link";
import { Button } from "@components/ui/button";
// import { GiPencilRuler } from "react-icons/gi";
import { Session, Habit } from "@app/types/types";
// import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";

type HabitCardFooterProps = {
  session: Session | null;
  habit: Habit;
  pathName: string;
  handleEdit: (habit: Habit) => void;
  handleActionUpdate: (habitId: string) => void;
  todayEntryLoading: boolean;
};

export function HabitCardFooter({
  session,
  habit,
  pathName,
  handleEdit,
  handleActionUpdate,
  todayEntryLoading,
}: HabitCardFooterProps) {
  // const { todayEntry, todayEntryLoading } = useTodayJournalEntry();

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
        {/* <GiPencilRuler className="ml-2" size={"1.2rem"} /> */}
      </Button>
      {/* <Link
        href={`/update-journal-entry/${todayEntry?._id}`}
        aria-disabled={todayEntryLoading}
      > */}
      <Button
        disabled={todayEntryLoading}
        onClick={() => handleActionUpdate(habit._id)}
      >
        Take Action!
      </Button>
      {/* </Link> */}
    </div>
  );
}
