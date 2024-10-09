import { HabitCard } from "@components/habits/habit-card/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit } from "@app/types/types";

type HabitListProps = {
  habits: Habit[];
  handleEdit: (habit: Habit) => void;
  getActionUpdateValues: (habitId: string) => any;
  todayEntryLoading: boolean;
  handleActionUpdate: () => void;
  // handleDelete: (habit: Habit) => Promise<void>;
};

export function HabitList({
  habits = [],
  handleEdit,
  getActionUpdateValues,
  todayEntryLoading,
  handleActionUpdate,
}: // handleDelete,
HabitListProps) {
  return (
    <Accordion type="single" collapsible className="w-full pb-1">
      {habits.map((habit: Habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          actionUpdateValues={getActionUpdateValues(habit._id)}
          handleEdit={handleEdit}
          // handleDelete={handleDelete}
          todayEntryLoading={todayEntryLoading}
          handleActionUpdate={handleActionUpdate}
        />
      ))}
    </Accordion>
  );
}
