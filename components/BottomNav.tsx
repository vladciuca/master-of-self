"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavButton } from "@/components/ui/nav-button";
import { Target, Shell } from "lucide-react";
import { FaSun } from "react-icons/fa";
import { IoMoonSharp } from "react-icons/io5";
import { GiNightSleep } from "react-icons/gi";
import { isEvening } from "@lib/time";
import { JOURNAL_COLORS } from "@lib/colors";
import type { UserProfile } from "@models/types";

type BottomNavProps = {
  userProfile: UserProfile;
  userProfileError: string | null;
};

export function BottomNav({ userProfile, userProfileError }: BottomNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerDisplay, setTimerDisplay] = useState("--:--");
  const [isNightMode, setIsNightMode] = useState(false);

  const userMorningTime = userProfile?.journalStartTime.morning;
  const userEveningTime = userProfile?.journalStartTime.evening;

  // Update current time every 30 seconds
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    updateTime(); // Initial trigger
    const timer = setInterval(updateTime, 30000); // Trigger every 30 seconds

    return () => clearInterval(timer); // Cleanup
  }, []);

  useEffect(() => {
    if (!userMorningTime || !userEveningTime) return;

    const updateTimerDisplay = () => {
      const now = currentTime;
      const morning = getTimeFromString(userMorningTime);
      const evening = getTimeFromString(userEveningTime);

      if (isBeforeTime(now, morning)) {
        // Countdown to morning (Night Mode)
        const diff = getTimeDifference(now, morning);
        setTimerDisplay(formatTime(diff));
        setIsNightMode(true);
      } else if (isBeforeTime(now, evening)) {
        // Countdown to evening (Day Mode)
        const diff = getTimeDifference(now, evening);
        setTimerDisplay(formatTime(diff));
        setIsNightMode(false);
      } else {
        // Countdown to midnight (Post-Evening Mode)
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = getTimeDifference(now, midnight);
        setTimerDisplay(formatTime(diff));
        setIsNightMode(false);
      }
    };

    // Run once immediately
    updateTimerDisplay();

    // Return cleanup function even if empty
    return () => {};
  }, [currentTime, userMorningTime, userEveningTime]);

  // Helper functions
  const getTimeFromString = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  };

  const isBeforeTime = (date: Date, time: Date) => {
    return (
      date.getHours() < time.getHours() ||
      (date.getHours() === time.getHours() &&
        date.getMinutes() < time.getMinutes())
    );
  };

  const getTimeDifference = (start: Date, end: Date) => {
    return new Date(end.getTime() - start.getTime());
  };

  const formatTime = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours}h ${minutes}m`;
  };

  const iconClass = "w-8 h-8";

  return (
    <nav className="h-full w-full flex justify-around items-center space-x-2 px-2">
      <Link href="/goals" className="flex-1">
        <NavButton>
          <Target className={iconClass} />
          <div className="text-xs mt-1">Goals</div>
        </NavButton>
      </Link>

      <Link href="/journal" className="flex-1">
        <NavButton>
          {isNightMode ? (
            <GiNightSleep
              className={`${iconClass} text-${JOURNAL_COLORS.sleep}`}
            />
          ) : !isEvening(userEveningTime) ? (
            <FaSun className={`${iconClass} text-${JOURNAL_COLORS.day}`} />
          ) : (
            <IoMoonSharp
              className={`${iconClass} text-${JOURNAL_COLORS.night}`}
            />
          )}
          <div className="text-xs mt-1">{timerDisplay}</div>
        </NavButton>
      </Link>

      <Link href="/habits" className="flex-1">
        <NavButton>
          <Shell className={iconClass} />
          <div className="text-xs mt-1">Habits</div>
        </NavButton>
      </Link>
      {/* {userProfileError && <div>{userProfileError}</div>} */}
    </nav>
  );
}
