import type React from "react";
import { stepStyles } from "@components/ui/constants";

interface JournalEntryIndicatorsProps {
  dayEntries: number;
  completedDailyToDos: number;
  nightEntries: number;
}

export function JournalEntryIndicators({
  dayEntries,
  completedDailyToDos,
  nightEntries,
}: JournalEntryIndicatorsProps) {
  return (
    <div className="h-full flex items-start ml-4 space-x-2 text-white">
      {dayEntries > 0 && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${stepStyles.day.bgColor}`}
        >
          {dayEntries}
        </div>
      )}
      {completedDailyToDos > 0 && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${stepStyles.night.bgColor}`}
        >
          {completedDailyToDos}
        </div>
      )}
      {nightEntries > 0 && (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${stepStyles.reflection.bgColor}`}
        >
          {nightEntries}
        </div>
      )}
    </div>
  );
}
