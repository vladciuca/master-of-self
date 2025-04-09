import React, { ReactNode, useState } from "react";
import { Card } from "@components/ui/card";
import { Switch } from "@components/ui/switch";
import { DisciplineLevelBar } from "@components/profile/disciplines/DisciplineLevelBar";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { cn } from "@lib/utils";
import { useUserProfile } from "@context/UserProfileContext";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
// import { JournalStepConfig } from "@models/types";

type CustomSwitchProps = {
  type: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled: boolean;
};

// Custom styled switch component
const CustomSwitch = ({
  type,
  checked,
  onCheckedChange,
  disabled,
}: CustomSwitchProps) => {
  // Dynamic styles based on type
  const trackColorClass =
    type === "dayEntry" ? "bg-yellow-500" : "bg-purple-500";

  return (
    <div className="relative inline-flex">
      {/* Custom overlay for the track */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-colors pointer-events-none",
          checked ? trackColorClass : "bg-muted"
        )}
      />

      {/* The switch component */}
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(checked ? trackColorClass : "bg-muted")}
      />

      {/* Icon overlay for the thumb */}
      <div className="absolute pointer-events-none top-0.5 left-0.5 flex h-5 w-5 items-center justify-center">
        <div
          className={cn(
            "absolute flex items-center justify-center h-5 w-5 rounded-full transition-transform bg-primary",
            checked && "translate-x-5"
          )}
        />
      </div>
    </div>
  );
};

type DisciplineStepProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  discipline: string;
  type?: string;
};

export function DisciplineStep({
  icon,
  title,
  description,
  discipline,
  type,
}: DisciplineStepProps) {
  const {
    userProfile,
    userProfileLoading,
    // handleRoutineChange
  } = useUserProfile();

  const [isActive, setIsActive] = useState(false);

  const IconElement = icon;

  // Get discipline data needed for the level bar
  const { todayEntry } = useTodayJournalEntry();
  const { lastEntry } = useLastJournalEntry();

  // Get XP values
  const disciplines = userProfile?.disciplines || {};
  const disciplinesProjectedXp = lastEntry
    ? getDisciplineScoreFromEntry(lastEntry)
    : {};

  // Calculate XP values
  let xp = disciplines[discipline] ?? 0;
  let projectedXp = disciplinesProjectedXp[discipline] ?? 0;

  // Check if there's no today's entry
  if (!todayEntry) {
    // Add projected XP to current XP
    xp = xp + projectedXp;
    // Reset projected XP to 0
    projectedXp = 0;
  }

  return (
    <Card className="mb-2 px-2 pt-5 pb-3">
      <div className="flex flex-row">
        {/* Icon section */}
        {IconElement && (
          <div className="w-2/12 flex items-center justify-center mb-0">
            {React.cloneElement(IconElement as React.ReactElement, {
              size: 40,
              className: "text-primary",
            })}
          </div>
        )}

        {/* Content section */}
        <div className={`${icon && type ? "w-8/12 px-2" : "w-full px-3"}`}>
          {/* <div className="w-8/12 px-2"> */}
          {/* <div className="mb-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div> */}

          {/* Level Bar */}
          <div className="-mt-2">
            <DisciplineLevelBar
              xp={xp}
              projectedXp={projectedXp}
              name={discipline}
              showXpMetrics={true}
              height={4}
            />
          </div>
        </div>

        {/* Toggle switch */}
        {type && (
          <div className="w-2/12 flex items-center justify-center mt-0">
            <CustomSwitch
              type={type}
              // checked={userProfile.steps[stepKey]}
              // onCheckedChange={() => handleRoutineChange(stepKey)}
              checked={isActive} // Replace with your actual state
              onCheckedChange={() => setIsActive(!isActive)} // Replace with your actual handler
              disabled={userProfileLoading}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
