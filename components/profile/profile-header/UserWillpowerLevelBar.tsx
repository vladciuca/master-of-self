//NOTE* USER LEVEL BAR - WIP COMPONENT - currently there is no logic for negative XP

import { motion } from "framer-motion";
import { useTotalWillpowerBeforeToday } from "@hooks/useTotalWillpowerBeforeToday";
import { useTodayJournalEntry } from "@hooks/journal/useTodayJournalEntry";
import { calculateLevel, xpForLevel } from "@lib/level";
import { JOURNAL_COLORS } from "@lib/colors";

export function UserWillpowerLevelBar() {
  const { totalWillpowerBeforeToday, totalWillpowerBeforeTodayLoading } =
    useTotalWillpowerBeforeToday();
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();

  // Use nullish coalescing (??) to default to 0 only when values are null/undefined,
  // preserving intentional zero values for willpower changes
  const bonusWillpower = todayEntry?.bonusWillpower ?? 0;
  const dailyWillpower = todayEntry?.dailyWillpower ?? 0;

  const currentXP = totalWillpowerBeforeToday;
  const bonusXP = bonusWillpower;
  const projectedXP = dailyWillpower;

  const level = calculateLevel(totalWillpowerBeforeToday);
  const { nextLevelXP } = xpForLevel(level);

  const isLoading = totalWillpowerBeforeTodayLoading || todayEntryLoading;

  // Calculate percentages
  const currentPercentage = isLoading
    ? 0
    : Math.max(0, Math.min(100, (currentXP / nextLevelXP) * 100));
  const bonusPercentage = isLoading
    ? 0
    : Math.max(0, Math.min(100, (bonusXP / nextLevelXP) * 100));

  // Adjust projectedPercentage calculation
  const projectedPercentage = isLoading
    ? 0
    : Math.max(
        0,
        Math.min(100 - currentPercentage, (projectedXP / nextLevelXP) * 100)
      );

  // Remove totalPositivePercentage and totalNegativePercentage
  // Instead, calculate displayTotalPercentage directly
  const displayTotalPercentage = Math.min(
    100,
    currentPercentage + bonusPercentage + projectedPercentage
  );

  // Calculate remaining percentage for negative projected XP
  const negativeProjectedPercentage =
    projectedXP < 0
      ? Math.min(
          currentPercentage + bonusPercentage,
          Math.abs((projectedXP / nextLevelXP) * 100)
        )
      : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-baseline justify-between text-primary text-xl mr-1 font-bold mx-1">
        <div className="text-sm">
          Level
          <span className="text-primary text-xl ml-1 font-bold">
            {totalWillpowerBeforeTodayLoading ? "??" : level}
          </span>
        </div>

        {!isLoading && (
          <span>
            <span className="">{displayTotalPercentage.toFixed()}%</span>
          </span>
        )}
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
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

          {/* CHANGE: Move negative projected XP bar here */}
          {projectedXP < 0 && (
            <motion.div
              className="h-full bg-pink-500 absolute top-0"
              initial={{ width: 0 }}
              animate={{ width: `${negativeProjectedPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              role="progressbar"
              aria-valuenow={negativeProjectedPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {negativeProjectedPercentage > 5 && (
                <span className="sr-only">
                  Projected XP Loss: {negativeProjectedPercentage.toFixed(1)}%
                </span>
              )}
            </motion.div>
          )}
          <motion.div
            className={`h-full bg-${JOURNAL_COLORS.night}`}
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
              className={`h-full bg-${JOURNAL_COLORS.day}`}
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
      {isLoading && (
        <div className="mx-1 mt-1 font-semibold text-xs text-muted-foreground">
          ??
        </div>
      )}
      {!isLoading && (
        <div className="mt-1 flex text-xs justify-between space-x-4 mx-1">
          <div className="space-x-2">
            {/* <span className="text-primary">
              <span className="mr-1">Previous:</span>
              <span className="font-semibold">{currentXP}</span>
              
            </span> */}
            {bonusXP > 0 && (
              <span className={`text-${JOURNAL_COLORS.night}`}>
                <span className="mr-1">Bonus:</span>
                <span className="font-semibold">{bonusXP}</span>
              </span>
            )}

            {projectedXP !== 0 && (
              <span
                className={`${
                  projectedXP < 0
                    ? "text-pink-500"
                    : `text-${JOURNAL_COLORS.day}`
                }`}
              >
                <span className="mr-1">Today:</span>
                <span className="font-semibold">{projectedXP}</span>
              </span>
            )}
          </div>

          <div className="flex flex-end">
            <span className="text-muted-foreground font-semibold">
              {/* Ensure the total XP doesn't exceed nextLevelXP */}
              {Math.min(currentXP + bonusXP + projectedXP, nextLevelXP)}/
              {nextLevelXP}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
