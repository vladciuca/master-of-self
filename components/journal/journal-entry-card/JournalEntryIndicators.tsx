import { stepStyles } from "@components/ui/constants";
import type { JournalDayEntry, JournalNightEntry } from "@models/types";

interface JournalEntryIndicatorsProps {
  dayEntry: JournalDayEntry;
  nightEntry: JournalNightEntry;
}

export function JournalEntryIndicators({
  dayEntry,
  nightEntry,
}: JournalEntryIndicatorsProps) {
  // Calculate dayEntries
  const dayEntries =
    (dayEntry?.gratitude?.length || 0) + (dayEntry?.day?.length || 0);

  // Calculate completedDailyToDos
  const completedDailyToDos = () => {
    const dailyToDos = dayEntry?.day || [];
    const completedToDos = nightEntry?.night || [];

    return completedToDos.filter((item) => dailyToDos.includes(item));
  };

  // Calculate nightEntries
  const nightEntries =
    (nightEntry?.highlights?.length || 0) +
    (nightEntry?.reflection?.length || 0);

  // Get the counts
  const completedDailyToDosCount = completedDailyToDos().length;

  return (
    <div className="h-full flex items-start ml-4 space-x-2 text-white">
      {dayEntries > 0 && (
        <div
          className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${stepStyles.day.bgColor}`}
        >
          {dayEntries}
        </div>
      )}
      {completedDailyToDosCount > 0 && (
        <div
          className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${stepStyles.night.bgColor}`}
        >
          {completedDailyToDosCount}
        </div>
      )}
      {nightEntries > 0 && (
        <div
          className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${stepStyles.reflection.bgColor}`}
        >
          {nightEntries}
        </div>
      )}
    </div>
  );
}
