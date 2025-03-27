"use client";

import { useEffect } from "react";
import { DisciplineLevelBar } from "./DisciplineLevelBar";
import { Skeleton } from "@components/ui/skeleton";
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

  // Check if any data is loading
  const isLoading =
    userSettingsLoading || todayEntryLoading || lastEntryLoading;

  // Check for any errors
  const hasError = userSettingsError || todayEntryError || lastEntryError;

  // Render error message if any error exists
  if (hasError) {
    return (
      <div>
        <span>Error:</span>
        <div>
          {userSettingsError ||
            todayEntryError ||
            lastEntryError ||
            "There was an error loading your disciplines. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-1 mb-4">
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {"Disciplines"}
        </CardTitle>
        <CardDescription>
          {
            "Each discipline corresponds with a step in your journal. To level up your discipline, engage those particular journal steps."
          }
        </CardDescription>
      </div>
      <Card className="space-y-4 p-4">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-start w-full">
                <Skeleton className="h-5 w-24 mb-4 mt-2" />
                <Skeleton className="h-4 w-full rounded-full mb-2" />
              </div>
            ))}
          </>
        ) : (
          <>
            {Object.entries(disciplines || {})
              .filter(([key, value]) => value > 0 || key === "motivation") //filter out XP bars with 0 value
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
          </>
        )}
      </Card>
    </div>
  );
}
