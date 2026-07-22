"use client";

import React from "react";
import { XpProgressBar } from "@components/practices/XpProgressBar";
import { Skeleton } from "@components/ui/skeleton";
import { useUserProfile } from "@context/UserProfileContext";
import { useUserPractices } from "@hooks/practices/useUserPractices";
import { useLastJournalEntry } from "@hooks/journal/useLastJournalEntry";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { DISCIPLINES } from "@lib/disciplines";
import { getDisciplineScoreFromEntry } from "@lib/score";
import type { Practice } from "@models/mongodb";

function DisciplineXpBarsSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={`skeleton-${i}`} className="flex items-center mb-3">
          <div className="flex-1">
            <Skeleton className="h-8 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function aggregateDisciplineXp(
  practiceScores: Record<string, number>,
  practices: Practice[]
): Record<string, number> {
  const xpMap: Record<string, number> = {};

  DISCIPLINES.forEach((config) => {
    xpMap[config.discipline] = 0;
  });

  Object.entries(practiceScores).forEach(([key, value]) => {
    if (key === "_disciplineMultiplier") return;

    if (key === "discipline") {
      xpMap["Discipline"] = (xpMap["Discipline"] || 0) + value;
      return;
    }

    const fixedConfig = DISCIPLINES.find(
      (config) => String(config._id) === key
    );
    if (fixedConfig) {
      xpMap[fixedConfig.discipline] =
        (xpMap[fixedConfig.discipline] || 0) + value;
      return;
    }

    if (/^[a-f\d]{24}$/i.test(key)) {
      const practice = practices.find(
        (practice) => String(practice._id) === key
      );
      if (practice) {
        xpMap[practice.discipline] =
          (xpMap[practice.discipline] || 0) + value;
      }
    }
  });

  return xpMap;
}

export function DisciplineXpBars() {
  const { userProfile, userProfileLoading, userProfileError } = useUserProfile();
  const { practices, practicesLoading, practicesError } = useUserPractices();
  const { lastEntry } = useLastJournalEntry();
  const { todayEntry } = useTodayJournalEntry();

  const { disciplineXp, projectedDisciplineXp } = React.useMemo(() => {
    const current = userProfile?.practices
      ? aggregateDisciplineXp(userProfile.practices, practices)
      : aggregateDisciplineXp({}, practices);

    const baseDisciplineXp = userProfile?.disciplines?.discipline ?? 0;
    current["Discipline"] = (current["Discipline"] || 0) + baseDisciplineXp;

    const projected = lastEntry
      ? aggregateDisciplineXp(getDisciplineScoreFromEntry(lastEntry), practices)
      : aggregateDisciplineXp({}, practices);

    if (!todayEntry) {
      DISCIPLINES.forEach((config) => {
        const name = config.discipline;
        current[name] = (current[name] || 0) + (projected[name] || 0);
        projected[name] = 0;
      });
    }

    return { disciplineXp: current, projectedDisciplineXp: projected };
  }, [userProfile?.practices, userProfile?.disciplines, practices, lastEntry, todayEntry]);

  if (userProfileLoading || practicesLoading) {
    return <DisciplineXpBarsSkeleton />;
  }

  if (userProfileError || practicesError) {
    return (
      <div className="py-4 text-red-500">
        Error loading disciplines: {userProfileError || practicesError}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {DISCIPLINES.map((config) => (
        <XpProgressBar
          key={config.discipline}
          xp={disciplineXp[config.discipline] ?? 0}
          projectedXp={projectedDisciplineXp[config.discipline] ?? 0}
          name={config.discipline}
          color={config.color}
          height={8}
        />
      ))}
    </div>
  );
}
