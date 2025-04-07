"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { stepIconMap } from "@/components/ui/constants";
import { cn } from "@/lib/utils";
import { isEvening } from "@/lib/time";
import { JOURNAL_COLORS } from "@/lib/colors";
import { useUserProfile } from "@context/UserProfileContext";

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

  const isEveningTime = isEvening(userProfile?.journalStartTime.evening);
  const eveningColor = isEveningTime
    ? JOURNAL_COLORS.night
    : JOURNAL_COLORS.day;
  const IconElement = isEveningTime ? stepIconMap.night : stepIconMap.day;

  // Only apply special disabled styling when submitting
  const disabledClasses = isSubmitting
    ? `disabled:bg-${eveningColor}/90 disabled:text-white`
    : "disabled:bg-transparent disabled:opacity-70";

  return (
    <Button
      onClick={handleClick}
      disabled={handleDisabled}
      size="sm"
      variant="outline"
      className={cn(
        `group border-${eveningColor}/40 hover:bg-${eveningColor}/90`,
        disabledClasses,
        "hover:text-white rounded-md font-normal w-full sm:w-auto py-5"
      )}
    >
      {React.cloneElement(IconElement as React.ReactElement, {
        className: cn(
          `mr-3 text-${eveningColor}`,
          isSubmitting ? "group-disabled:text-white" : "",
          "group-hover:text-white transition-colors"
        ),
        size: 20,
      })}
      {text}
    </Button>
  );
}
