"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { stepIconMap } from "@/components/ui/constants";
import { cn } from "@/lib/utils";
import { isEvening } from "@/lib/time";
import { JOURNAL_COLORS } from "@/lib/colors";
import { useUserSettings } from "@/context/UserSettingsContext";

type JournalEntryActionButtonProps = {
  text: string;
  handleClick?: () => void;
  handleDisabled?: boolean;
};

export function JournalEntryActionButton({
  text,
  handleClick = () => {},
  handleDisabled = false,
}: JournalEntryActionButtonProps) {
  const { userSettings, userSettingsLoading } = useUserSettings();

  const isEveningTime = isEvening(userSettings.journalStartTime.evening);
  const eveningColor = isEveningTime
    ? JOURNAL_COLORS.night
    : JOURNAL_COLORS.day;
  const IconElement = isEveningTime ? stepIconMap.night : stepIconMap.day;

  return (
    <Button
      onClick={handleClick}
      disabled={handleDisabled}
      size="sm"
      variant="outline"
      className={cn(
        `group border-${eveningColor}/40 hover:bg-${eveningColor}/90`,
        "hover:text-white rounded-full font-normal w-full sm:w-auto sm:px-6 py-5"
      )}
    >
      {React.cloneElement(IconElement as React.ReactElement, {
        className: cn(
          `mr-2 sm:mr-4 text-${eveningColor}`,
          "group-hover:text-white transition-colors"
        ),
        size: 20,
      })}
      {text}
    </Button>
  );
}
