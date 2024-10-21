"use client";

import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { useHabitsIcons } from "@hooks/useHabitsIcons";

type JournalEntryHabitsProp = {
  habitsXp: { [key: string]: number };
};

export function JournalEntryHabits({ habitsXp }: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habitsXp);

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => (
        <div key={id} className="flex items-center mr-3 my-1">
          <div className="text-xl">
            {habitData[id] ? (
              <IconRenderer
                iconName={habitData[id].icon}
                xp={habitData[id].xp}
                className="h-[25px] w-[25px] p-[3px] rounded-md"
              />
            ) : (
              <Skeleton className="h-6 w-6 rounded-md" />
            )}
          </div>
          <div className="flex items-center text-primary">
            <span className="text-green-500 text-sm ml-2">
              +{value}
              <span className="text-primary ml-1">XP</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
