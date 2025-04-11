import { HabitCard } from "@components/habits/habit-card/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit, JournalEntryHabit } from "@models/types";

type HabitListProps = {
  habits: Habit[];
  defaultHabitActionValues: JournalEntryHabit;
  handleEdit: (habit: Habit) => void;
  // handleDelete: (habit: Habit) => Promise<void>;
  entryLoading: boolean;
  habitActionsValuesFromEntry: JournalEntryHabit;
  entryTotalWillpower: number;
  submittingJournalEntry: boolean;
  handleActionUpdate: (habitId: string) => void;
  hasNoEntryToday: boolean;
};

export function HabitList({
  habits = [],
  defaultHabitActionValues = {},
  handleEdit,
  // handleDelete,
  entryLoading,
  habitActionsValuesFromEntry,
  entryTotalWillpower,
  handleActionUpdate,
  submittingJournalEntry,
  hasNoEntryToday,
}: HabitListProps) {
  return (
    <Accordion type="single" collapsible className="w-full pb-1 mt-2">
      {habits.map((habit: Habit) => {
        return (
          <HabitCard
            key={habit._id}
            habit={habit}
            entryLoading={entryLoading}
            // NOTE: now that the Entry has the default values when created
            // there is no need for fallback
            // check if no habits exist, fallback will be required
            habitDefaultActionValues={defaultHabitActionValues[habit._id] || {}}
            habitActionValues={habitActionsValuesFromEntry[habit._id] || {}}
            entryTotalWillpower={entryTotalWillpower}
            handleEdit={handleEdit}
            submittingJournalEntry={submittingJournalEntry}
            handleActionUpdate={handleActionUpdate}
            hasNoEntryToday={hasNoEntryToday}
          />
        );
      })}
    </Accordion>
  );
}
