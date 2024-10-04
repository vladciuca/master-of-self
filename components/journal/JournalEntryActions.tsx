"use client";

import { IconRenderer } from "@/components/IconRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@components/ui/badge";
import { Hash, Clock, CircleAlert, OctagonAlert } from "lucide-react";
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
                    {action.type === "offensive" ? (
                      <CircleAlert className="mr-2 text-blue-500" size={20} />
                    ) : (
                      <OctagonAlert className="mr-2 text-blue-500" size={20} />
                    )}
                    <Badge variant="outline" className="capitalize">
                      {action.metric === "count" ? (
                        <Hash size={18} className="mr-2" />
                      ) : (
                        <Clock size={18} className="mr-2" />
                      )}
                      {value}
                    </Badge>
                    {/* <span className="text-sm text-gray-500 mr-2">
                      {action.metric}
                    </span>
                    <span className="text-sm text-gray-500">{action.type}</span> */}
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
