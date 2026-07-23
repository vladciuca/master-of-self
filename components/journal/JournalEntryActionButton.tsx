"use client";

import { Loader2 } from "lucide-react";
import { IconRenderer } from "@components/IconRenderer";
import { getTimePeriodIconAndColor } from "@components/ui/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentTimePeriod } from "@lib/time";
import { hasEntryContent } from "@lib/journal";
import { useUserProfile } from "@context/UserProfileContext";
import type { JournalEntryMetadata } from "@models/types";

type JournalEntryActionButtonProps = {
  text?: string;
  journalEntry?: JournalEntryMetadata | null;
  size?: "sm" | "default" | "lg" | "icon" | null | undefined;
  handleClick?: () => void;
  handleDisabled?: boolean;
  isSubmitting?: boolean;
};

export function JournalEntryActionButton({
  text,
  journalEntry = null,
  size = "sm",
  handleClick = () => {},
  handleDisabled = false,
  isSubmitting = false,
}: JournalEntryActionButtonProps) {
  //NOTE: no error handling
  const { userProfile, userProfileLoading } = useUserProfile();

  const timePeriod = getCurrentTimePeriod(
    userProfile?.journalStartTime.morning,
    userProfile?.journalStartTime.evening,
  );

  const { periodColor, iconName } = getTimePeriodIconAndColor(timePeriod);

  const isProfileLoadingState = userProfileLoading && !isSubmitting;

  const getLoopText = (): string => {
    if (timePeriod === "sleep") return "Continue your morning loop";

    if (timePeriod === "night") {
      return hasEntryContent(journalEntry?.nightEntry)
        ? "Continue your evening loop"
        : "Start your evening loop";
    }

    return journalEntry
      ? "Continue your morning loop"
      : "Start your morning loop";
  };

  const label = isSubmitting
    ? "Entering the loop..."
    : isProfileLoadingState
      ? "Loading your loop..."
      : (text ?? getLoopText());

  // Only apply special disabled styling when submitting
  const disabledClasses = isSubmitting
    ? `disabled:bg-${periodColor}/90 disabled:text-white`
    : "disabled:opacity-70";

  return (
    <Button
      onClick={handleClick}
      disabled={handleDisabled || isProfileLoadingState}
      size={size}
      variant="outline"
      className={cn(
        isProfileLoadingState
          ? "border-muted bg-muted text-muted-foreground"
          : `group border-${periodColor}/40 bg-${periodColor} text-white hover:bg-${periodColor}/90`,
        disabledClasses,
        "rounded-full font-normal w-full cursor-pointer",
      )}
    >
      {isSubmitting ? (
        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
      ) : (
        !isProfileLoadingState && (
          <IconRenderer
            iconName={iconName}
            size={20}
            className="mr-3 text-white"
          />
        )
      )}
      {label}
    </Button>
  );
}
