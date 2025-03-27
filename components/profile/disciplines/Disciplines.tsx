"use client";

import { useEffect } from "react";
import { DisciplineLevelBar } from "./DisciplineLevelBar";
import { Card, CardDescription, CardTitle } from "@components/ui/card";
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
            let xp = value;
            //last entry -> returns projected XP
            let projectedXp = disciplinesProjectedXp[key] ?? 0;

            // Check if there's no today's entry
            if (!todayEntry) {
              // Add projected XP to current XP
              xp = xp + projectedXp;
              // Reset projected XP to 0
              projectedXp = 0;
            }

            return (
              <div key={key} className="flex flex-col items-start">
                <DisciplineLevelBar
                  xp={xp}
                  projectedXp={projectedXp}
                  name={key}
                />
              </div>
            );
          })}
      </Card>
    </div>
  );
}
