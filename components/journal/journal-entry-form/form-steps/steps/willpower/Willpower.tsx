import { useFormContext } from "react-hook-form";
import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { WillpowerScoreDisplay } from "@components/journal/journal-entry-form/form-steps/WillpowerScoreDisplay";
import { DisciplineLevelBar } from "@components/profile/disciplines/DisciplineLevelBar";
import { calculateStepScore, calculateStepScoreMultiplier } from "@lib/score";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry, UserDisciplines, Session } from "@models/types";
import { useUserSettings } from "@context/UserSettingsContext";

export function Willpower() {
  const { userSettings } = useUserSettings();
  const { watch, setValue } = useFormContext<JournalEntry>();

  const bonusWillpower = watch("bonusWillpower");
  const dailyWillpower = watch("dailyWillpower");
  const totalWillpower = bonusWillpower + dailyWillpower;

  //DAY
  const gratitude = watch("dayEntry.gratitude");
  const day = watch("dayEntry.day");
  const affirmations = watch("dayEntry.affirmations");

  //Night
  const night = watch("nightEntry.night");
  const highlights = watch("nightEntry.highlights");
  const reflection = watch("nightEntry.reflection");

  const disciplineScores = {
    positivity: calculateStepScore(gratitude ?? []),
    motivation:
      calculateStepScore(day ?? []) * calculateStepScoreMultiplier(night ?? []),
    confidence: calculateStepScore(affirmations ?? []),
    awareness: calculateStepScore(highlights ?? []),
    resilience: calculateStepScore(reflection ?? []),
  };

  // Filter discipline scores to get only those with values > 0
  const filteredDisciplineScores = Object.entries(
    disciplineScores || {}
  ).filter(([key, value]) => {
    return value > 0;
  });

  // Check if there are any discipline scores with values > 0
  const hasPositiveDisciplineScores = filteredDisciplineScores.length > 0;

  return (
    <JournalStepTemplate
      title={"Willpower Generated"}
      description={
        "Increase your daily Willpower by working on your morning journaling."
      }
      scoreSection={
        <div className="flex flex-col items-center">
          <WillpowerScoreDisplay
            willpower={totalWillpower}
            color={JOURNAL_COLORS.day}
          />
        </div>
      }
    >
      <div className="flex flex-col justify-center px-2 sm:px-6 mt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-tight mb-8">
            Discipline Points Earned
          </h2>
          {hasPositiveDisciplineScores ? (
            filteredDisciplineScores.map(([key, value]) => {
              const disciplineKey = key as keyof UserDisciplines;
              const projectedXp = value;
              const xp = userSettings.disciplines[disciplineKey] ?? 0;

              return (
                <div key={key} className="flex flex-col items-start mb-4">
                  <DisciplineLevelBar
                    xp={xp}
                    projectedXp={projectedXp}
                    name={key}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center py-6">
              <span className="text-md text-muted-foreground mb-4">
                Complete more journal pages to earn points in Disciplines and
                increase Willpower.
              </span>
            </div>
          )}
        </div>
      </div>
    </JournalStepTemplate>
  );
}
