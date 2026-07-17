import { XpProgressBar } from "@components/practices/XpProgressBar";
import { PracticeSwitch } from "@components/practices/discipline-card/PracticeSwitch";
import { IconRenderer } from "@components/IconRenderer";
import { AddNewButton } from "@components/profile/AddNewButton";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { isHexColor } from "@lib/utils";
import { useUserProfile } from "@context/UserProfileContext";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";

type PracticeCardHeaderProps = {
  practiceId: string;
  icon?: string;
  color?: string;
  disciplineName: string;
  type?: string;
  addNew?: boolean;
  onboarding?: boolean;
};

export function PracticeCardHeader({
  practiceId,
  icon,
  color,
  disciplineName,
  type,
  addNew = false,
  onboarding = false,
}: PracticeCardHeaderProps) {
  const {
    userProfile,
    updateActivePractice,
    userProfileLoading,
    userProfileError,
  } = useUserProfile();

  // Get discipline data needed for the level bar
  const { todayEntry } = useTodayJournalEntry();
  const { lastEntry } = useLastJournalEntry();

  const handleToggle = (checked: boolean) => {
    updateActivePractice(practiceId, checked);
  };

  const isActive =
    userProfile?.activePractices?.includes(practiceId) ?? false;

  // Get XP values
  const isBaseDiscipline = practiceId === "discipline";
  const xpMap = isBaseDiscipline
    ? userProfile?.disciplines || {}
    : userProfile?.practices || {};
  const projectedXpMap = lastEntry
    ? getDisciplineScoreFromEntry(lastEntry)
    : {};

  // Calculate XP values
  let xp = xpMap[practiceId] ?? 0;
  let projectedXp = projectedXpMap[practiceId] ?? 0;

  // Check if there's no today's entry
  if (!todayEntry) {
    // Add projected XP to current XP
    xp = xp + projectedXp;
    // Reset projected XP to 0
    projectedXp = 0;
  }

  const getTextColor = (key: string): string =>
    key === "discipline" ? "text-muted-foreground" : "text-primary";

  return (
    <div className="flex flex-row w-full items-center">
      {/* Icon section */}
      {icon && (
        <div className="w-1/12 flex items-center justify-center mb-0">
          <IconRenderer
            iconName={icon}
            className={isHexColor(color) ? "" : `text-${color}`}
            size={30}
            style={isHexColor(color) ? { color: color } : undefined}
          />
        </div>
      )}

      {/* Content section */}
      <div className={`${icon ? "flex-grow" : "w-full px-3"}`}>
        {/* Level Bar */}
        <XpProgressBar
          xp={xp}
          projectedXp={projectedXp}
          name={disciplineName}
          // showXpMetrics={true}
          height={8}
          color={color}
          textColor={getTextColor(practiceId)}
        />
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="ml-2 flex items-center justify-center mt-0">
          <PracticeSwitch
            type={type}
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={userProfileLoading}
          />
        </div>
      )}
      {!type && addNew && (
        <div className="ml-2 flex items-center justify-center mt-0">
          <AddNewButton
            title="Create New Practice"
            linkTo="/explore-practices"
            disabled={onboarding}
          />
        </div>
      )}
    </div>
  );
}
