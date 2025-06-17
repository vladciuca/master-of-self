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
  size?: number;
};

export function JournalEntryHabits({
  habitsXp,
  habits,
  size = 25,
}: JournalEntryHabitsProp) {
  const { journalHabits, habitData } = useHabitsIcons(habitsXp);

  return (
    // <div className="flex items-center flex-wrap mt-4">
    //   {Object.entries(journalHabits).map(([id, value]) => {
    //     const currentXp = habits[id]?.currentXp || 0;

    //     // Only render the habit if its value is not 0
    //     if (value !== 0) {
    //       return (
    //         <div key={id} className="flex items-center mr-3 my-1 flex-1 mb-2">
    //           <div className="text-xl">
    //             {habitData[id] ? (
    //               <IconRenderer
    //                 iconName={habitData[id].icon}
    //                 xp={currentXp + value}
    //                 className={`h-[${size}px] w-[${size}px] p-[2px] rounded-md`}
    //                 size={size}
    //               />
    //             ) : (
    //               <Skeleton className="h-6 w-6 rounded-md" />
    //             )}
    //           </div>
    //           <div
    //             className={`flex items-center text-primary ${
    //               size > 25 ? "text-md" : "text-sm"
    //             }`}
    //           >
    //             <span className="ml-2">
    //               <XpDisplay xpValue={value} />
    //               <span className="text-primary ml-1">XP</span>
    //             </span>
    //           </div>
    //         </div>
    //       );
    //     }

    //     // Return null for habits with value 0
    //     return null;
    //   })}
    // </div>
    <div className="grid grid-cols-3 gap-x-10 gap-y-4 mt-4 justify-items-center">
      {Object.entries(journalHabits).map(([id, value]) => {
        const currentXp = habits[id]?.currentXp || 0;

        // Only render the habit if its value is not 0
        if (value !== 0) {
          return (
            <div key={id} className="flex items-center w-full">
              <div className="text-xl">
                {habitData[id]?.icon ? (
                  <IconRenderer
                    iconName={habitData[id].icon}
                    xp={currentXp + value}
                    className={`h-[${size}px] w-[${size}px] p-[2px] rounded-md`}
                    size={size}
                  />
                ) : (
                  <Skeleton
                    className="rounded-md"
                    style={{ height: `${size}px`, width: `${size}px` }}
                  />
                )}
              </div>
              <div
                className={`flex items-center text-primary ${
                  size > 25 ? "text-md" : "text-sm"
                }`}
              >
                <span className="ml-2">
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
