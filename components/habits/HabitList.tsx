import { HabitCard } from "@components/habits/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit } from "@app/types/types";

type HabitListProps = {
  habits: Habit[];
  // handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
};

export function HabitList({
  habits,
}: // handleEdit,
// handleDelete,
HabitListProps) {
  return (
    <Accordion type="single" collapsible className="w-full pb-1">
      {habits.map((habit: Habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          // handleEdit={handleEdit}
          // handleDelete={handleDelete}
        />
      ))}
    </Accordion>
  );
}
