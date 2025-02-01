"use client";

import { IconRenderer } from "@components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { useHabitsIcons } from "@hooks/useHabitsIcons";
import type { ActionItem, Actions } from "@app/types/types";

type JournalEntryHabitsProp = {
  habitsXp: ActionItem;
  actions: Actions;
};

export function JournalEntryHabits({
  habitsXp,
  actions,
}: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habitsXp);

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => {
        const currentXp = actions[id]?.currentXp || 0;
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
              <span className="text-green-500 text-sm ml-2">
                +{value}
                <span className="text-primary ml-1">XP</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
