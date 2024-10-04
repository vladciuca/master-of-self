"use client";

import { IconRenderer } from "@/components/IconRenderer";
import { ActionIcon } from "@components/habits/HabitActionFragments";
import { Badge } from "@components/ui/badge";
import { Hash, Clock } from "lucide-react";
import { useUserHabits } from "@hooks/useUserHabits";
import { Habit, Action } from "@app/types/types";

type JournalEntryActionsProp = {
  actions: { [key: string]: { [key: string]: number } };
};

export function JournalEntryActions({ actions }: JournalEntryActionsProp) {
  const { habits, habitsLoading } = useUserHabits();

  return (
    <div className="flex flex-col w-full">
      {Object.entries(actions).map(([habitId, habitActions]) => (
        <div key={habitId} className="flex flex-col mb-4">
          <div className="flex items-center">
            <div className="flex items-center">
              {habits.map((habit) => {
                if (habit._id === habitId) {
                  return (
                    <IconRenderer
                      iconName={habit.icon}
                      className="h-6 w-6"
                      xp={habit.xp}
                    />
                  );
                }
              })}
            </div>
            <div className="flex items-center space-x-2 ml-2">
              {Object.entries(habitActions).map(([actionId, value]) => {
                const habit = habits.find((h: Habit) => h._id === habitId);
                const action = habit?.actions.find(
                  (a: Action) => a.id === actionId
                );

                if (!action) return null;

                return (
                  <div key={actionId} className="flex items-center">
                    <ActionIcon type={action.type} size={18} />
                    <Badge variant="outline" className="capitalize">
                      {action.metric === "count" ? (
                        <Hash size={18} className="mr-2" />
                      ) : (
                        <Clock size={18} className="mr-2" />
                      )}
                      {value}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
