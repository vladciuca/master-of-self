import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { DisciplineSwitch } from "@components/disciplines/discipline-card/DisciplineSwitch";
import { IconRenderer } from "@components/IconRenderer";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { useUserProfile } from "@context/UserProfileContext";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useUpdateActiveDisciplines } from "@hooks/user/useUpdateActiveDisciplines";

type DisciplineCardProps = {
  disciplineId: string;
  icon?: string;
  color?: string;
  discipline: string;
  type?: string;
};

export function DisciplineCardHeader({
  disciplineId,
  icon,
  color,
  discipline,
  type,
}: DisciplineCardProps) {
  const { userProfile, userProfileLoading } = useUserProfile();
  const { isDisciplineActive, toggleActiveDiscipline, isLoading } =
    useUpdateActiveDisciplines();

  // Get discipline data needed for the level bar
  const { todayEntry } = useTodayJournalEntry();
  const { lastEntry } = useLastJournalEntry();

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

  const handleToggle = (checked: boolean) => {
    toggleActiveDiscipline(disciplineId, checked);
  };

  return (
    <div className="flex flex-row w-full">
      {/* Icon section */}
      {icon && (
        <div className="w-2/12 flex items-center justify-center mb-0">
          <IconRenderer iconName={icon} className={`text-${color}`} size={40} />
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
            color={color}
          />
        </div>
      </div>

      {/* Toggle switch */}
      {type && (
        <div className="w-2/12 flex items-center justify-center mt-0">
          <DisciplineSwitch
            type={type}
            checked={isDisciplineActive(disciplineId)}
            onCheckedChange={handleToggle}
            disabled={userProfileLoading || isLoading}
          />
        </div>
      )}
    </div>
  );
}
