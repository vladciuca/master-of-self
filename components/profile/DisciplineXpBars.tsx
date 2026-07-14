"use client";

import React from "react";
import { DisciplineProgressBar } from "@components/disciplines/DisciplineProgressBar";
import { Skeleton } from "@components/ui/skeleton";
import { useUserProfile } from "@context/UserProfileContext";
import { useUserDisciplines } from "@hooks/disciplines/useUserDisciplines";
import { DISCIPLINES } from "@lib/disciplines";

function DisciplineXpBarsSkeleton() {
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

export function DisciplineXpBars() {
  const { userProfile, userProfileLoading, userProfileError } = useUserProfile();
  const { disciplines, disciplinesLoading, disciplinesError } =
    useUserDisciplines();

  const disciplineXp = React.useMemo(() => {
    const xpMap: Record<string, number> = {};

    DISCIPLINES.forEach((config) => {
      xpMap[config.discipline] = 0;
    });

    const userDisciplines = userProfile?.disciplines;
    if (!userDisciplines) return xpMap;

    Object.entries(userDisciplines).forEach(([key, value]) => {
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
        const practice = disciplines.find(
          (practice) => String(practice._id) === key
        );
        if (practice) {
          xpMap[practice.discipline] =
            (xpMap[practice.discipline] || 0) + value;
        }
      }
    });

    return xpMap;
  }, [userProfile?.disciplines, disciplines]);

  if (userProfileLoading || disciplinesLoading) {
    return <DisciplineXpBarsSkeleton />;
  }

  if (userProfileError || disciplinesError) {
    return (
      <div className="py-4 text-red-500">
        Error loading disciplines: {userProfileError || disciplinesError}
      </div>
    );
  }

  return (
    <div className="space-y-5 mx-2">
      {DISCIPLINES.map((config) => (
        <DisciplineProgressBar
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
