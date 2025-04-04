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
  // Calculate dayEntries by counting all entries in dayEntry object
  const dayEntries = Object.entries(dayEntry || {})
    .filter(
      ([key, value]) =>
        key !== "day" && Array.isArray(value) && value.length > 0
    )
    .reduce((total, [_, value]) => total + (value?.length || 0), 0);

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
        key !== "night" && Array.isArray(value) && value.length > 0
    )
    .reduce((total, [_, value]) => total + (value?.length || 0), 0);

  // Get the counts
  const completedDailyToDosCount = completedDailyToDos().length;

  return (
    <div className="h-full flex items-start ml-4 space-x-2 text-white">
      {dayEntries > 0 && (
        <div
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${journalStepStyle.dayEntry.bgColor}`}
        >
          {dayEntries}
        </div>
      )}
      {completedDailyToDosCount > 0 && (
        <div
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${journalStepStyle.night.bgColor}`}
        >
          {completedDailyToDosCount}
        </div>
      )}
      {nightEntries > 0 && (
        <div
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${journalStepStyle.nightEntry.bgColor}`}
        >
          {nightEntries}
        </div>
      )}
    </div>
  );
}
