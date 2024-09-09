"use client";

import React, { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
// import { Shell } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

type JournalEntryHabitsProp = {
  habits: { [key: string]: number };
};

const JournalEntryHabits = ({ habits }: JournalEntryHabitsProp) => {
  const [journalHabits, setJournalHabits] = useState(habits);
  const [habitIcons, setHabitIcons] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchHabitIcons = async () => {
      const habitIds = Object.keys(habits);

      try {
        const response = await fetch(
          `/api/habit/icons?ids=${habitIds.join(",")}`
        );
        if (response.ok) {
          const icons: { [key: string]: string } = await response.json();
          const filteredJournalHabits = filterHabitIcons(habits, icons);

          setHabitIcons(icons);
          // BUG: If a habit has been deleted, it's icon will remain stuck in skeleton with its latest value
          // FIX: Filtered habits with icon response from DB to remove the deleted habit
          // and to not be displayed in Journal Entry Card
          // Should consider what happens to a habit after it is deleted or if it can be deleted
          // means the habit doesn't exist in db anymore
          setJournalHabits(filteredJournalHabits);
        }
      } catch (error) {
        console.error("Failed to fetch habit icons:", error);
      }
    };

    if (Object.keys(habits).length > 0) {
      fetchHabitIcons();
    }
  }, [habits]);

  const filterHabitIcons = (
    habits: { [key: string]: number },
    icons: { [key: string]: string }
  ) => {
    return Object.fromEntries(
      Object.entries(habits).filter(([key]) => key in icons)
    );
  };

  return (
    <div className="flex items-center flex-wrap">
      {Object.entries(journalHabits).map(([id, value]) => (
        <div key={id} className="flex items-center mr-3">
          {/* the icon size with skeleton highs need to corelate so content wont jiggle: 1.4rem : ~30px */}
          <div className="text-xl">
            {habitIcons[id] ? (
              <div>
                <em-emoji shortcodes={habitIcons[id]} size="1.4rem" />
              </div>
            ) : (
              <div>
                <Skeleton className="w-[30px] h-[30px] rounded-full" />
              </div>
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
