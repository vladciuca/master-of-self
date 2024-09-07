"use client";

import React, { useState, useEffect } from "react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { Shell } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

type JournalEntryHabitsProp = {
  habits: { [key: string]: number };
};

const JournalEntryHabits = ({ habits }: JournalEntryHabitsProp) => {
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
          setHabitIcons(icons);
        }
      } catch (error) {
        console.error("Failed to fetch habit icons:", error);
      }
    };

    if (Object.keys(habits).length > 0) {
      fetchHabitIcons();
    }
  }, [habits]);

  return (
    <div className="flex items-center space-x-2 flex-wrap">
      <h2 className="flex items-center">
        <Shell className="mr-2 text-muted-foreground" size={"1rem"} />
        Habits:
      </h2>
      {Object.entries(habits).map(([id, value]) => {
        if (value === 0) return null;

        return (
          <div key={id} className="flex items-center">
            <div className="text-xl">
              {habitIcons[id] ? (
                <div>
                  <em-emoji shortcodes={habitIcons[id]} size="1.4rem" />
                </div>
              ) : (
                <div>
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
              )}
            </div>
            <div className="flex items-center text-primary">
              <span className="ml-1 font-semibold">{value}</span>
              <FaBoltLightning className="ml-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JournalEntryHabits;
