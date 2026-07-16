"use client";

import React from "react";
import { XpProgressBar } from "@components/practices/XpProgressBar";
import { Skeleton } from "@components/ui/skeleton";
import { usePracticeData } from "@hooks/practices/usePracticeData";
import { DISCIPLINES } from "@lib/disciplines";
import type { UserProfile } from "@models/types";

function UserDisciplineXpBarsSkeleton() {
  return (
    <div className="space-y-5 mx-2">
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

type UserDisciplineXpBarsProps = {
  userProfile: UserProfile;
};

export function UserDisciplineXpBars({ userProfile }: UserDisciplineXpBarsProps) {
  const practiceIds = Object.keys(userProfile.practices || {}).filter((id) =>
    /^[a-f\d]{24}$/i.test(id)
  );
  const { practiceData, isLoading } = usePracticeData(
    undefined,
    undefined,
    practiceIds
  );

  const disciplineXp = React.useMemo(() => {
    const xpMap: Record<string, number> = {};

    DISCIPLINES.forEach((config) => {
      xpMap[config.discipline] = 0;
    });

    Object.entries(userProfile.practices || {}).forEach(([key, value]) => {
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

      if (/^[a-f\d]{24}$/i.test(key) && practiceData[key]) {
        const disciplineName = practiceData[key].name;
        if (disciplineName && xpMap[disciplineName] !== undefined) {
          xpMap[disciplineName] = (xpMap[disciplineName] || 0) + value;
        }
      }
    });

    const baseDisciplineXp = userProfile.disciplines?.discipline ?? 0;
    xpMap["Discipline"] = (xpMap["Discipline"] || 0) + baseDisciplineXp;

    return xpMap;
  }, [userProfile.practices, userProfile.disciplines, practiceData]);

  if (isLoading) {
    return <UserDisciplineXpBarsSkeleton />;
  }

  return (
    <div className="space-y-5 mx-2">
      {DISCIPLINES.map((config) => (
        <XpProgressBar
          key={config.discipline}
          xp={disciplineXp[config.discipline] ?? 0}
          projectedXp={0}
          name={config.discipline}
          color={config.color}
          height={8}
        />
      ))}
    </div>
  );
}
