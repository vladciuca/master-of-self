import { HabitCard } from "@components/habits/habit-card/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit, Actions } from "@app/types/types";
import {
  getHabitActionValuesFromEntry,
  getHabitActionDefaultValues,
} from "@lib/level";

type HabitListProps = {
  habits: Habit[];
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  entryLoading: boolean;
  habitActionsFromEntry: Actions;
  lastEntryWillpower: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;

  isNotToday: boolean;
};

export function HabitList({
  habits = [],
  handleEdit,
  // handleDelete,
  entryLoading,
  habitActionsFromEntry,
  lastEntryWillpower,
  handleActionUpdate,
  submittingJournalEntry,
  isNotToday,
}: HabitListProps) {
  // NOTE: should use memo here too
  const habitDefaultActionValues = getHabitActionDefaultValues(habits);
  const habitActionValues = getHabitActionValuesFromEntry(
    habitActionsFromEntry
  );

  return (
    <Accordion type="single" collapsible className="w-full pb-1">
      {habits.map((habit: Habit) => {
        const dailyHabitActionValues = isNotToday
          ? habitDefaultActionValues[habit._id]
          : habitActionValues[habit._id];
        return (
          <HabitCard
            key={habit._id}
            habit={habit}
            entryLoading={entryLoading}
            // habitActionValues={dailyHabitActionValues || {}}
            // NOTE: now that the Entry has the default values when created
            // there is no need for fallback
            // check if no habits exist, fallback will be required
            habitActionValues={dailyHabitActionValues}
            lastEntryWillpower={lastEntryWillpower}
            handleEdit={handleEdit}
            submittingJournalEntry={submittingJournalEntry}
            handleActionUpdate={handleActionUpdate}
          />
        );
      })}
    </Accordion>
  );
}
