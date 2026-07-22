import { journalStepStyle } from "@components/ui/constants";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";

interface JournalEntryIndicatorsProps {
  dayEntry: JournalDayEntry;
  nightEntry: JournalNightEntry;
}

export function JournalEntryIndicators({
  dayEntry,
  nightEntry,
}: JournalEntryIndicatorsProps) {
  // Calculate uncompleted todos
  const uncompletedTodos = () => {
    const dailyToDos = dayEntry?.day || [];
    const completedToDos = nightEntry?.night || [];

    return dailyToDos.filter((item) => !completedToDos.includes(item));
  };

  const uncompletedTodosCount = uncompletedTodos().length;

  const dayEntries = Object.entries(dayEntry || {})
    .filter(
      ([key, value]) =>
        key !== "day" &&
        key !== "repeat" &&
        key !== "carryOver" &&
        Array.isArray(value) &&
        value.length > 0,
    )
    .reduce((total, [_, value]) => total + (value?.length || 0), 0);

  // Add uncompleted todos to dayEntries
  const totalDayEntries = dayEntries + uncompletedTodosCount;

  // Calculate completedDailyToDos
  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.day || [];
    const completedToDos = nightEntry?.night || [];

    return completedToDos.filter((item) => dailyToDos.includes(item));
  };

  // Calculate nightEntries by counting all entries in nightEntry object
  const nightEntries = Object.entries(nightEntry || {})
    .filter(
      ([key, value]) =>
        key !== "night" && Array.isArray(value) && value.length > 0,
    )
    .reduce((total, [_, value]) => total + (value?.length || 0), 0);

  // Get the counts
  const completedDailyToDosCount = completedDailyToDos().length;

  return (
    <div className="ml-4 flex items-center space-x-3 text-muted-foreground">
      {totalDayEntries > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-primary">{totalDayEntries}</span>x
          <div
            className={`w-[15px] h-[15px] rounded-full ${journalStepStyle.dayEntry.bgColor}`}
          />
        </div>
      )}
      {completedDailyToDosCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-primary">
            {completedDailyToDosCount}
          </span>x
          <div
            className={`w-[15px] h-[15px] rounded-full ${journalStepStyle.night.bgColor}`}
          />
        </div>
      )}
      {nightEntries > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-primary">{nightEntries}</span>x
          <div
            className={`w-[15px] h-[15px] rounded-full ${journalStepStyle.nightEntry.bgColor}`}
          />
        </div>
      )}
    </div>
  );
}
