"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconRenderer } from "@components/IconRenderer";
import { NavButton } from "@components/ui/nav-button";
import { getTimePeriodIconAndColor } from "@components/ui/constants";
import { HiUser, HiUserGroup } from "react-icons/hi2";
import { getCurrentTimePeriod, getCountdownToNextPeriod } from "@lib/time";
import type { UserProfile } from "@models/types";

type BottomNavProps = {
  userProfile: UserProfile;
  userProfileError: string | null;
};

export function BottomNav({ userProfile, userProfileError }: BottomNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerDisplay, setTimerDisplay] = useState("--:--");

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
      const countdown = getCountdownToNextPeriod(
        userMorningTime,
        userEveningTime
      );
      setTimerDisplay(countdown);
    };

    // Run once immediately
    updateTimerDisplay();

    // Return cleanup function even if empty
    return () => {};
  }, [currentTime, userMorningTime, userEveningTime]);

  // Get the current time period using the utility function
  const timePeriod = getCurrentTimePeriod(
    userProfile?.journalStartTime.morning,
    userProfile?.journalStartTime.evening
  );

  const { periodColor, iconName } = getTimePeriodIconAndColor(timePeriod);

  return (
    <nav className="h-full w-full flex justify-around items-center px-2">
      <Link href="/profile" className="flex-1 flex justify-center w-full">
        <NavButton>
          <HiUser size={34} />
        </NavButton>
      </Link>

      <Link href="/journal" className="flex-1 flex justify-center w-full">
        <NavButton>
          <IconRenderer
            iconName={iconName}
            size={28}
            className={`text-${periodColor}`}
          />
          <div className="text-xs mt-1">{timerDisplay}</div>
        </NavButton>
      </Link>

      <Link href="/" className="flex-1 flex justify-center w-full">
        <NavButton>
          <HiUserGroup size={40} />
        </NavButton>
      </Link>
      {/* {userProfileError && <div>{userProfileError}</div>} */}
    </nav>
  );
}
