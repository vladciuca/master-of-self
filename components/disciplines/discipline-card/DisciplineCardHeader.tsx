import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { DisciplineSwitch } from "@components/disciplines/discipline-card/DisciplineSwitch";
import { IconRenderer } from "@components/IconRenderer";
import { AddNewButton } from "@components/profile/AddNewButton";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { useUserProfile } from "@context/UserProfileContext";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";

type DisciplineCardProps = {
  disciplineId: string;
  icon?: string;
  color?: string;
  discipline: string;
  type?: string;
  addNew?: boolean;
};

export function DisciplineCardHeader({
  disciplineId,
  icon,
  color,
  discipline,
  type,
  addNew = false,
}: DisciplineCardProps) {
  const {
    userProfile,
    updateActiveDiscipline,
    userProfileLoading,
    userProfileError,
  } = useUserProfile();

  // Get discipline data needed for the level bar
  const { todayEntry } = useTodayJournalEntry();
  const { lastEntry } = useLastJournalEntry();

  //add/remove IDS to ACTIVE_DISCIPLINE LIST
  const handleToggle = (checked: boolean) => {
    updateActiveDiscipline(disciplineId, checked);
  };

  const isActive =
    userProfile?.activeDisciplines?.includes(disciplineId) ?? false;

  // Get XP values
  const disciplines = userProfile?.disciplines || {};
  const disciplinesProjectedXp = lastEntry
    ? getDisciplineScoreFromEntry(lastEntry)
    : {};

  // Calculate XP values
  let xp = disciplines[disciplineId] ?? 0;
  let projectedXp = disciplinesProjectedXp[disciplineId] ?? 0;

  // Check if there's no today's entry
  if (!todayEntry) {
    // Add projected XP to current XP
    xp = xp + projectedXp;
    // Reset projected XP to 0
    projectedXp = 0;
  }
  const isDisciplineId = (key: string): boolean => /^[a-f\d]{24}$/i.test(key);
  const getTextColor = (key: string): string =>
    isDisciplineId(key) ? "text-primary" : "text-muted-foreground";

  return (
    <div className="flex flex-row w-full items-center">
      {/* Icon section */}
      {icon && (
        <div className="w-1/12 flex items-center justify-center mb-0">
          <IconRenderer iconName={icon} className={`text-${color}`} size={30} />
        </div>
      )}

      {/* Content section */}
      <div className={`${icon ? "flex-grow" : "w-full px-3"}`}>
        {/* Level Bar */}
        <DisciplineProgressBar
          xp={xp}
          projectedXp={projectedXp}
          name={discipline}
          // showXpMetrics={true}
          height={8}
          color={color}
          textColor={getTextColor(disciplineId)}
        />
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="ml-2 flex items-center justify-center mt-0">
          <DisciplineSwitch
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
            title="Create New Discipline"
            linkTo="/explore-disciplines"
          />
        </div>
      )}
    </div>
  );
}
