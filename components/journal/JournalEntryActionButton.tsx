"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { stepIconMap } from "@/components/ui/constants";
import { cn } from "@/lib/utils";
// import { isEvening } from "@/lib/time";
import { JOURNAL_COLORS } from "@/lib/colors";
import { useUserProfile } from "@context/UserProfileContext";

import { getCurrentTimePeriod } from "@lib/time";

type JournalEntryActionButtonProps = {
  text: string;
  handleClick?: () => void;
  handleDisabled?: boolean;
  isSubmitting?: boolean; // New prop to track if we're in submitting state
};

export function JournalEntryActionButton({
  text,
  handleClick = () => {},
  handleDisabled = false,
  isSubmitting = false, // Default to false
}: JournalEntryActionButtonProps) {
  //NOTE: no error handling
  const { userProfile, userProfileLoading } = useUserProfile();

  const timePeriod = getCurrentTimePeriod(
    userProfile?.journalStartTime.morning,
    userProfile?.journalStartTime.evening
  );

  // Determine icon and color based on time period
  let periodColor;
  let IconElement;

  switch (timePeriod) {
    case "sleep":
      periodColor = JOURNAL_COLORS.sleep;
      IconElement = stepIconMap.sleep;
      break;
    case "night":
      periodColor = JOURNAL_COLORS.night;
      IconElement = stepIconMap.night;
      break;
    default: // 'day'
      periodColor = JOURNAL_COLORS.day;
      IconElement = stepIconMap.day;
      break;
  }

  // const isEveningTime = isEvening(userProfile?.journalStartTime.evening);
  // const eveningColor = isEveningTime
  //   ? JOURNAL_COLORS.night
  //   : JOURNAL_COLORS.day;
  // const IconElement = isEveningTime ? stepIconMap.night : stepIconMap.day;

  // Only apply special disabled styling when submitting
  const disabledClasses = isSubmitting
    ? `disabled:bg-${periodColor}/90 disabled:text-white`
    : "disabled:bg-transparent disabled:opacity-70";

  return (
    <Button
      onClick={handleClick}
      disabled={handleDisabled}
      size="sm"
      variant="outline"
      className={cn(
        `group border-${periodColor}/40 hover:bg-${periodColor}/90`,
        disabledClasses,
        "hover:text-white rounded-md font-normal w-full sm:w-auto py-5"
      )}
    >
      {React.cloneElement(IconElement as React.ReactElement, {
        className: cn(
          `mr-3 text-${periodColor}`,
          isSubmitting ? "group-disabled:text-white" : "",
          "group-hover:text-white transition-colors"
        ),
        size: 20,
      })}
      {text}
    </Button>
  );
}
