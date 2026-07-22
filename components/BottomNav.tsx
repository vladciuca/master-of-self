"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRenderer } from "@components/IconRenderer";
import { NavButton } from "@components/ui/nav-button";
import { ProgressRing } from "@components/ui/progress-ring";
import { getTimePeriodIconAndColor } from "@components/ui/constants";
import { HiUser, HiUserGroup } from "react-icons/hi2";
import {
  getCurrentTimePeriod,
  getCountdownToNextPeriod,
  getCurrentPeriodProgress,
} from "@lib/time";
import { JOURNAL_HEX_COLORS } from "@lib/colors";
import type { UserProfile } from "@models/types";

type BottomNavProps = {
  userProfile: UserProfile;
  userProfileError: string | null;
};

export function BottomNav({ userProfile, userProfileError }: BottomNavProps) {
  const pathname = usePathname();
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

  const periodHexColor =
    timePeriod === "day"
      ? JOURNAL_HEX_COLORS.dayHex
      : timePeriod === "night"
        ? JOURNAL_HEX_COLORS.nightHex
        : JOURNAL_HEX_COLORS.sleepHex;

  const periodProgress = getCurrentPeriodProgress(
    userMorningTime,
    userEveningTime
  );

  const isJournalActive = pathname.startsWith("/journal");

  return (
    <nav className="h-full w-full flex justify-around items-center px-2">
      <Link href="/profile" className="flex-1 flex justify-center w-full">
        <NavButton isActive={pathname.startsWith("/profile")}>
          <HiUser size={34} />
        </NavButton>
      </Link>

      <Link href="/journal" className="flex-1 flex justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="-mt-14">
            <ProgressRing
              progress={periodProgress}
              colorHex={periodHexColor}
              size={72}
              strokeWidth={6}
            >
              <IconRenderer
                iconName={iconName}
                size={28}
                className={
                  isJournalActive ? `text-${periodColor}` : "text-primary"
                }
              />
            </ProgressRing>
          </div>
          <div className="text-xs mt-2">{timerDisplay}</div>
        </div>
      </Link>

      <Link href="/community" className="flex-1 flex justify-center w-full">
        <NavButton isActive={pathname.startsWith("/community")}>
          <HiUserGroup size={40} />
        </NavButton>
      </Link>
      {/* {userProfileError && <div>{userProfileError}</div>} */}
    </nav>
  );
}
