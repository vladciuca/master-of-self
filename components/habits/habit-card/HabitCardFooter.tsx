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
    <div className="mt-12 flex justify-between">
      <Button
        variant="secondary"
        onClick={() => handleEdit(habit)}
        className="mr-3"
        size="sm"
      >
        Edit
      </Button>
      {/* <Button variant="ghost" onClick={() => handleDelete(habit)} size="sm">
        Delete(TEST)
      </Button> */}
      <Button size="sm">Take Action!</Button>
    </div>
  );
}
