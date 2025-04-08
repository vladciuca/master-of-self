import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { WillpowerScoreDisplay } from "@components/journal/journal-entry-form/form-steps/WillpowerScoreDisplay";
import { DisciplineLevelBar } from "@components/profile/disciplines/DisciplineLevelBar";
import { getDayDisciplineScores, getNightDisciplineScores } from "@lib/score";
import { JOURNAL_COLORS } from "@lib/colors";
import type { UserDisciplines } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";
import { stepIconMap } from "@components/ui/constants";
import { isEvening } from "@lib/time";

export const Willpower = () => {
  const { watch } = useFormContext();
  const { userProfile } = useUserProfile();

  const userEveningTime = userProfile?.journalStartTime.evening;
  const isEveningTime = isEvening(userEveningTime);

  const bonusWillpower = watch("bonusWillpower");
  const dailyWillpower = watch("dailyWillpower");
  const totalWillpower = bonusWillpower + dailyWillpower;

  const dayEntry = watch("dayEntry");
  const nightEntry = watch("nightEntry");

  // Get discipline scores for day and night
  const dayDisciplines = getDayDisciplineScores(dayEntry);
  const nightDisciplines = getNightDisciplineScores(nightEntry);

  // Filter out motivation from day and night disciplines before rendering
  const filteredDayDisciplineScores = Object.entries(
    dayDisciplines || {}
  ).filter(([key, value]) => key !== "motivation" && value > 0);

  const filteredNightDisciplineScores = Object.entries(
    nightDisciplines || {}
  ).filter(([key, value]) => key !== "motivation" && value > 0);

  // Calculate motivation score (multiply day and night values)
  const motivationDayScore = dayDisciplines.motivation || 0;
  const motivationNightScore = nightDisciplines.motivation || 0;
  const motivationScore = motivationDayScore * motivationNightScore;

  // Check if there are any discipline scores with values > 0
  const hasPositiveDayDisciplineScores = filteredDayDisciplineScores.length > 0;
  const hasPositiveNightDisciplineScores =
    filteredNightDisciplineScores.length > 0;

  // Consolidated section title and empty state message
  const sectionTitle = isEveningTime
    ? "Evening Disciplines"
    : "Morning Disciplines";
  const emptyStateMessage = isEveningTime
    ? "Complete evening journal pages to earn points."
    : "Complete morning journal pages to earn points.";

  // Function to render discipline bars
  const renderDisciplineBars = (
    disciplineScores: [string, number][],
    sectionKey: string
  ) => {
    return disciplineScores.map(([key, value]) => {
      const disciplineKey = key as keyof UserDisciplines;
      const projectedXp = value;
      const xp = userProfile.disciplines[disciplineKey] ?? 0;

      return (
        <div
          key={`${sectionKey}-${key}`}
          className="flex flex-col items-start mb-4"
        >
          <DisciplineLevelBar
            xp={xp}
            projectedXp={projectedXp}
            name={key}
            height={3}
          />
        </div>
      );
    });
  };

  return (
    <JournalStepTemplate
      title={"Willpower"}
      description={"Generate Willpower for today from your morning journaling."}
      scoreSection={
        <div className="flex flex-col items-center">
          <WillpowerScoreDisplay
            willpower={totalWillpower}
            color={JOURNAL_COLORS.day}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-center px-4 sm:px-8 mt-6">
        <div className="text-center">
          <h2 className="text-muted w-full flex justify-center text-5xl font-semibold tracking-tight mb-8">
            {isEveningTime ? stepIconMap.night : stepIconMap.day}
          </h2>
          <div className="flex flex-col w-full">
            {/* Always show Motivation section before the current disciplines section */}
            {/* <h4 className="text-xl font-semibold mb-8">{sectionTitle}</h4> */}

            {((!isEveningTime && motivationScore > 0) ||
              (isEveningTime &&
                motivationScore > 0 &&
                motivationNightScore > 1)) && (
              <div className="">
                <div className="flex flex-col items-start mb-4">
                  <DisciplineLevelBar
                    xp={userProfile.disciplines.motivation ?? 0}
                    projectedXp={motivationScore}
                    name="motivation"
                    height={3}
                  />
                </div>
              </div>
            )}

            <div className="">
              {(
                isEveningTime
                  ? hasPositiveNightDisciplineScores
                  : hasPositiveDayDisciplineScores
              ) ? (
                <>
                  {renderDisciplineBars(
                    isEveningTime
                      ? filteredNightDisciplineScores
                      : filteredDayDisciplineScores,
                    isEveningTime ? "night" : "day"
                  )}
                </>
              ) : (
                <>
                  {(motivationScore <= 0 || motivationNightScore <= 1) && (
                    <div className="flex items-center justify-center py-4">
                      <span className="text-md text-muted-foreground">
                        {emptyStateMessage}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </JournalStepTemplate>
  );
};
