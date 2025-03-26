"use client";

import { useEffect } from "react";
import { DisciplineLevelBar } from "./DisciplineLevelBar";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
import { calculateDisciplineLevel, xpForDisciplineLevel } from "@lib/level";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { getDisciplineScoreFromEntry } from "@lib/score";
import { useUserSettings } from "@context/UserSettingsContext";

export function Disciplines() {
  const {
    userSettings,
    userSettingsLoading,
    userSettingsError,
    refetchUserSettings,
  } = useUserSettings();
  const { disciplines } = userSettings;

  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();
  const { lastEntry, lastEntryLoading, lastEntryError } = useLastJournalEntry();

  const disciplinesProjectedXp: { [key: string]: number | undefined } =
    lastEntry ? getDisciplineScoreFromEntry(lastEntry) : {};

  // refetch const { disciplines } = userSettings; on mount
  // Might change the dependency to something else
  useEffect(() => {
    refetchUserSettings();
  }, []);

  //   console.log("=============disciplines", disciplines);
  //   console.log("=============disciplinesProjectedXp", disciplinesProjectedXp);

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Disciplines"}
        </CardTitle>
        <CardDescription>
          {
            "Each discipline corresponds with a step in your journal. To level up your discipline, engage in completing the those particular journal steps."
          }
        </CardDescription>
      </div>
      <Card className="space-y-4 p-4">
        {Object.entries(disciplines || {})
          //   .filter(([_, value]) => value > 0) //filter out XP bars with 0 value
          .map(([key, value]) => {
            const projectedXp = disciplinesProjectedXp[key] ?? 0;

            // const effectiveXP = !todayEntry ? value + projectedXp : value;
            const effectiveXP = todayEntry ? value : value + projectedXp;

            // Calculate XP and level based on effective XP
            const currentLevel = calculateDisciplineLevel(effectiveXP);
            const { baseXP, nextLevelXP } = xpForDisciplineLevel(currentLevel);

            // Calculate XP within the current level
            const currentLevelXP = effectiveXP - baseXP;
            const xpNeededForCurrentLevel = nextLevelXP - baseXP;

            // const xpGain = !todayEntry ? 0 : projectedXp;
            const xpGain = todayEntry ? projectedXp : 0;

            return (
              <div key={key} className="flex flex-col items-start">
                <div className="flex items-baseline justify-between w-full mt-1">
                  <h2 className="text-lg font-semibold capitalize mb-1">
                    {key}
                  </h2>

                  {todayEntry && projectedXp > 0 && (
                    <span className="text-lg font-semibold text-green-500">
                      +{projectedXp}
                    </span>
                  )}
                </div>

                <DisciplineLevelBar
                  currentXP={currentLevelXP}
                  nextLevelXP={xpNeededForCurrentLevel}
                  xpGain={xpGain}
                />
                <div className="flex items-baseline justify-between w-full mt-2">
                  <span className="text-muted-foreground text-sm font-bold">
                    Level {currentLevel}
                  </span>

                  <span className="text-muted-foreground text-sm font-bold">
                    {currentLevelXP + projectedXp}/{xpNeededForCurrentLevel}
                  </span>
                </div>
              </div>
            );
          })}
      </Card>
    </div>
  );
}
