"use client";

import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { XpDisplay } from "@components/ui/xp-display";
import { useHabitsIcons } from "@hooks/useHabitsIcons";
import type {
  JournalEntryHabit,
  JournalEntryHabitActions,
} from "@models/types";

type JournalEntryHabitsProp = {
  habitsXp: JournalEntryHabitActions;
  habits: JournalEntryHabit;
};

export function JournalEntryHabits({
  habitsXp,
  habits,
}: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habitsXp);

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => {
        const currentXp = habits[id]?.currentXp || 0;

        // Only render the habit if its value is not 0
        if (value !== 0) {
          return (
            <div key={id} className="flex items-center mr-3 my-1">
              <div className="text-xl">
                {habitData[id] ? (
                  <IconRenderer
                    iconName={habitData[id].icon}
                    xp={currentXp + value}
                    className="h-[25px] w-[25px] p-[2px] rounded-md"
                  />
                ) : (
                  <Skeleton className="h-6 w-6 rounded-md" />
                )}
              </div>
              <div className="flex items-center text-primary">
                <span className="text-sm ml-2">
                  <XpDisplay xpValue={value} />
                  <span className="text-primary ml-1">XP</span>
                </span>
              </div>
            </div>
          );
        }

        // Return null for habits with value 0
        return null;
      })}
    </div>
  );
}
