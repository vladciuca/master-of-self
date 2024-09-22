"use client";

import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";
import { useHabitsIcons } from "@hooks/useHabitsIcons";

type JournalEntryHabitsProp = {
  habits: { [key: string]: number };
};

export function JournalEntryHabits({ habits }: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habits);

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => (
        <div key={id} className="flex items-center mr-3 my-1">
          <div className="text-xl">
            {habitData[id] ? (
              <IconRenderer
                iconName={habitData[id].icon}
                xp={habitData[id].xp}
                className="h-6 w-6"
              />
            ) : (
              <Skeleton className="h-6 w-6 rounded-md" />
            )}
          </div>
          <div className="flex items-center text-primary">
            <span className="ml-1 font-semibold">{value}</span>
            <FaBoltLightning className="ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
