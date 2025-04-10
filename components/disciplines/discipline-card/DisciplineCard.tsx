import React, { ReactNode, useState } from "react";
import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { DisciplineSwitch } from "@components/disciplines/discipline-card/DisciplineSwitch";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { useUserProfile } from "@context/UserProfileContext";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";

type DisciplineCardProps = {
  icon?: ReactNode;
  discipline: string;
  type?: string;
};

//NOTE: this can be DisciplineCardHeader to keep convention with Habits?
export function DisciplineCard({
  icon,
  discipline,
  type,
}: DisciplineCardProps) {
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
    <div className="flex flex-row w-full">
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
        {/* Level Bar */}
        <div className="-mt-2">
          <DisciplineProgressBar
            xp={xp}
            projectedXp={projectedXp}
            name={discipline}
            showXpMetrics={true}
            height={3}
          />
        </div>
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="w-2/12 flex items-center justify-center mt-0">
          <DisciplineSwitch
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
  );
}
