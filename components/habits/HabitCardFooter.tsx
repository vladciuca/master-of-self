import { Session, Habit } from "@app/types/types";
import { Button } from "@components/ui/button";

type HabitCardFooterProps = {
  session: Session | null;
  habit: Habit;
  pathName: string;
  handleEdit: (habit: Habit) => void;
  //   handleDelete: (habit: Habit) => Promise<void>;
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
    <div className="mt-12">
      <Button onClick={() => handleEdit(habit)} className="mr-3" size="sm">
        Update
      </Button>
      {/* <Button variant="ghost" onClick={() => handleDelete(habit)} size="sm">
        Delete(TEST)
      </Button> */}
    </div>
  );
}
