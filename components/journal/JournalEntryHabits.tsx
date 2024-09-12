"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { IconRenderer } from "@/components/IconRenderer";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@/app/types/types";

type JournalEntryHabitsProp = {
  habits: { [key: string]: number };
};

type HabitData = {
  icon: string;
  xp: number;
};

const JournalEntryHabits = ({ habits }: JournalEntryHabitsProp) => {
  const [journalHabits, setJournalHabits] = useState(habits);
  const [habitData, setHabitData] = useState<{ [key: string]: HabitData }>({});
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    const fetchHabitData = async () => {
      const habitIds = Object.keys(habits);

      try {
        const response = await fetch(
          `/api/users/${session?.user.id}/habits/icons?ids=${habitIds.join(
            ","
          )}`
        );
        if (response.ok) {
          const data: { [key: string]: HabitData } = await response.json();
          const filteredJournalHabits = filterHabitData(habits, data);

          setHabitData(data);
          // BUG: If a habit has been deleted, it's icon will remain stuck in skeleton with its latest value
          // FIX: Filtered habits with icon response from DB to remove the deleted habit
          // and to not be displayed in Journal Entry Card
          // Should consider what happens to a habit after it is deleted or if it can be deleted
          // means the habit doesn't exist in db anymore
          setJournalHabits(filteredJournalHabits);
        }
      } catch (error) {
        console.error("Failed to fetch habit data:", error);
      }
    };

    if (Object.keys(habits).length > 0) {
      fetchHabitData();
    }
  }, [habits, session?.user.id]);

  const filterHabitData = (
    habits: { [key: string]: number },
    data: { [key: string]: HabitData }
  ) => {
    return Object.fromEntries(
      Object.entries(habits).filter(([key]) => key in data)
    );
  };

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => (
        <div key={id} className="flex items-center mr-3">
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
};

export default JournalEntryHabits;
