import { useMemo } from "react";
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
  hasNoEntryToday: boolean;
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
  hasNoEntryToday,
}: HabitListProps) {
  // NOTE: should use memo for values here too
  // const habitDefaultActionValues = getHabitActionDefaultValues(habits);
  // const habitActionValues = getHabitActionValuesFromEntry(
  //   habitActionsFromEntry
  // );

  const habitDefaultActionValues = useMemo(() => {
    console.log("Computing habitDefaultActionValues");
    return getHabitActionDefaultValues(habits);
  }, [habits]);

  const habitActionValues = useMemo(() => {
    console.log("Computing habitActionValues");
    return getHabitActionValuesFromEntry(habitActionsFromEntry);
  }, [habitActionsFromEntry]);

  return (
    <Accordion type="single" collapsible className="w-full pb-1">
      {habits.map((habit: Habit) => {
        return (
          <HabitCard
            key={habit._id}
            habit={habit}
            entryLoading={entryLoading}
            // NOTE: now that the Entry has the default values when created
            // there is no need for fallback
            // check if no habits exist, fallback will be required
            habitDefaultActionValues={habitDefaultActionValues[habit._id] || 0}
            habitActionValues={habitActionValues[habit._id] || 0}
            lastEntryWillpower={lastEntryWillpower}
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
