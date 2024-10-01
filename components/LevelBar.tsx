import React from "react";
import { useCurrentWillpower } from "@hooks/useCurrentWillpower";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { motion } from "framer-motion";

interface LevelBarProps {
  level: number;
  maxXP: number;
}

export function LevelBar({ level, maxXP }: LevelBarProps) {
  const { currentWillpower, currentWillpowerLoading } = useCurrentWillpower();
  const { todayEntry, todayEntryLoading, todayEntryError } =
    useTodayJournalEntry();

  const bonusWillpower = todayEntry?.bonusWillpower ?? 0;
  const dailyWillpower = todayEntry?.dailyWillpower ?? 0;

  const currentXP = currentWillpower;
  const bonusXP = bonusWillpower;
  const projectedXP = dailyWillpower - bonusWillpower;

  const isLoading = currentWillpowerLoading || todayEntryLoading;

  const currentPercentage = isLoading
    ? 0
    : Math.max(0, Math.min(100, (currentXP / maxXP) * 100));
  const bonusPercentage = isLoading
    ? 0
    : Math.max(0, Math.min(100, (bonusXP / maxXP) * 100));
  const projectedPercentage = isLoading ? 0 : (projectedXP / maxXP) * 100;

  const totalPositivePercentage =
    currentPercentage + bonusPercentage + Math.max(0, projectedPercentage);
  const totalNegativePercentage = Math.abs(Math.min(0, projectedPercentage));

  const displayTotalPercentage = Math.max(
    0,
    Math.min(100, totalPositivePercentage - totalNegativePercentage)
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-baseline justify-between text-primary text-xl mr-1 font-bold tracking-wide mx-1">
        <div className="text-sm">
          Level
          <span className="text-primary text-xl ml-1 font-bold">{level}</span>
        </div>

        {!isLoading && (
          <span>
            <span className="">{displayTotalPercentage.toFixed()}%</span>
          </span>
        )}
      </div>
      <div className="h-6 bg-muted rounded-full overflow-hidden">
        <div className="h-full flex relative">
          <motion.div
            className="h-full bg-primary relative"
            initial={{ width: 0 }}
            animate={{ width: `${currentPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            role="progressbar"
            aria-valuenow={currentPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {currentPercentage > 5 && (
              <span className="sr-only">
                Current XP: {currentPercentage.toFixed(1)}%
              </span>
            )}
          </motion.div>

          {projectedXP < 0 && (
            <motion.div
              className="h-full bg-pink-500 absolute top-0"
              initial={{ width: 0 }}
              animate={{ width: `${totalNegativePercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              role="progressbar"
              aria-valuenow={totalNegativePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {totalNegativePercentage > 5 && (
                <span className="sr-only">
                  Projected XP Loss: {totalNegativePercentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
          )}
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${bonusPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            role="progressbar"
            aria-valuenow={bonusPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {bonusPercentage > 5 && (
              <span className="sr-only">
                Bonus XP: {bonusPercentage.toFixed(1)}%
              </span>
            )}
          </motion.div>
          {projectedXP > 0 && (
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${projectedPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              role="progressbar"
              aria-valuenow={projectedPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {projectedPercentage > 5 && (
                <span className="sr-only">
                  Projected XP Gain: {projectedPercentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {!isLoading && (
        <div className="mt-1 flex text-xs justify-between space-x-4 mx-1">
          <div className="space-x-2">
            <span className="text-primary">
              <span className="mr-1 font-normal">Previous:</span>
              {currentXP}
            </span>
            <span className="text-green-500">
              <span className="mr-1 font-normal">Bonus:</span>
              {bonusXP}
            </span>
            <span
              className={projectedXP < 0 ? "text-pink-500" : "text-purple-500"}
            >
              <span className="mr-1 font-normal">Today:</span>
              {projectedXP}
            </span>
          </div>

          <div className="flex flex-end">
            <span className="text-muted-foreground">
              {currentXP + bonusXP + projectedXP}
              <span className="font-normal">/</span>
              {maxXP}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
