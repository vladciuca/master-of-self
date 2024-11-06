import { HabitCard } from "@components/habits/habit-card/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit } from "@app/types/types";

type HabitListProps = {
  habits: Habit[];
  handleEdit: (habit: Habit) => void;
  getActionUpdateValues: (habitId: string) => any;
  entryLoading: boolean;
  willpowerMultiplier: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
};

export function HabitList({
  habits = [],
  handleEdit,
  getActionUpdateValues,
  entryLoading,
  willpowerMultiplier,
  handleActionUpdate,
  submittingJournalEntry,
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
          entryLoading={entryLoading}
          willpowerMultiplier={willpowerMultiplier}
          submittingJournalEntry={submittingJournalEntry}
          handleActionUpdate={handleActionUpdate}
        />
      ))}
    </Accordion>
  );
}
