"use client";

import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { useHabitsIcons } from "@hooks/useHabitsIcons";

type JournalEntryHabitsProp = {
  habitsXp: { [key: string]: number };
};

export function HabitsUsed({ habitsXp }: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habitsXp);

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => (
        <div key={id} className="flex flex-col items-center mx-3 my-1">
          <div className="text-xl">
            {habitData[id] ? (
              <IconRenderer
                iconName={habitData[id].icon}
                xp={habitData[id].xp + value}
                className="h-16 w-16 p-[4px] rounded-md"
              />
            ) : (
              <Skeleton className="h-6 w-6 rounded-md" />
            )}
          </div>
          <div className="flex items-center text-primary mt-2">
            <span className="text-green-500 text-2xl">
              +{value}
              <span className="text-primary ml-1">XP</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
