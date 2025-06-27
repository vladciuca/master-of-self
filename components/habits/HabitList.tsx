import { HabitCard } from "@components/habits/habit-card/HabitCard";
import { Accordion } from "@components/ui/accordion";
import { Habit, JournalEntryHabit } from "@models/types";

type HabitListProps = {
  habits: Habit[];
  defaultHabitActionValues: JournalEntryHabit;
  handleEdit: (habit: Habit) => void;
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
  entryLoading,
  habitActionsValuesFromEntry,
  entryTotalWillpower,
  handleActionUpdate,
  submittingJournalEntry,
  hasNoEntryToday,
}: HabitListProps) {
  return (
    <Accordion type="single" collapsible className="w-full pb-1 mt-1">
      <HabitCard
        key="new-habit"
        addNew
        habit={{
          _id: "new-habit",
          name: "New Habit",
          icon: "FaCircleQuestion",
          xp: 0,
          xpData: [],
          creatorId: "none",
          actions: [],
        }}
        entryLoading={false}
        habitDefaultActionValues={{}}
        habitActionValues={{}}
        entryTotalWillpower={0}
        handleEdit={() => {}}
        submittingJournalEntry={false}
        handleActionUpdate={() => {}}
        hasNoEntryToday={false}
      />

      {habits.length === 0 ? (
        <div className="text-center text-muted-foreground py-4 px-8">
          You don’t have any habits yet. Start by creating one.
        </div>
      ) : (
        habits.map((habit: Habit) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            entryLoading={entryLoading}
            habitDefaultActionValues={defaultHabitActionValues[habit._id] || {}}
            habitActionValues={habitActionsValuesFromEntry[habit._id] || {}}
            entryTotalWillpower={entryTotalWillpower}
            handleEdit={handleEdit}
            submittingJournalEntry={submittingJournalEntry}
            handleActionUpdate={handleActionUpdate}
            hasNoEntryToday={hasNoEntryToday}
          />
        ))
      )}
    </Accordion>
  );
}
