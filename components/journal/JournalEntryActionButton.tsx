"use client";

import { IconRenderer } from "@components/IconRenderer";
import { getTimePeriodIconAndColor } from "@components/ui/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentTimePeriod } from "@lib/time";
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

  const timePeriod = getCurrentTimePeriod(
    userProfile?.journalStartTime.morning,
    userProfile?.journalStartTime.evening,
  );

  const { periodColor, iconName } = getTimePeriodIconAndColor(timePeriod);

  // Only apply special disabled styling when submitting
  const disabledClasses = isSubmitting
    ? `disabled:bg-${periodColor}/90 disabled:text-white`
    : "disabled:opacity-70";

  return (
    <Button
      onClick={handleClick}
      disabled={handleDisabled}
      size="sm"
      variant="outline"
      className={cn(
        `group border-${periodColor}/40 bg-${periodColor} text-white hover:bg-${periodColor}/90`,
        disabledClasses,
        "rounded-full font-normal w-full py-5",
      )}
    >
      <IconRenderer
        iconName={iconName}
        size={20}
        className="mr-3 text-white"
      />
      {text}
    </Button>
  );
}
