import React from "react";

interface LevelBarProps {
  level: number;
  currentXP: number;
  bonusXP: number;
  projectedXP: number;
  maxXP: number;
}

export function LevelBar({
  level,
  currentXP,
  bonusXP,
  projectedXP,
  maxXP,
}: LevelBarProps) {
  const currentPercentage = Math.max(
    0,
    Math.min(100, (currentXP / maxXP) * 100)
  );
  const bonusPercentage = Math.max(0, Math.min(100, (bonusXP / maxXP) * 100));
  const projectedPercentage = (projectedXP / maxXP) * 100;

  const totalPositivePercentage =
    currentPercentage + bonusPercentage + Math.max(0, projectedPercentage);
  const totalNegativePercentage = Math.abs(Math.min(0, projectedPercentage));

  const displayTotalPercentage = Math.max(
    0,
    Math.min(100, totalPositivePercentage - totalNegativePercentage)
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground mx-1">
        <span>Level {level}</span>
        <span>{displayTotalPercentage.toFixed()}%</span>
      </div>
      <div className="h-6 bg-muted rounded-full overflow-hidden">
        <div className="h-full flex relative">
          <div
            className="h-full bg-primary"
            style={{ width: `${currentPercentage}%` }}
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
          </div>
          {projectedXP < 0 && (
            <div
              className="h-full bg-red-500"
              style={{ width: `${totalNegativePercentage}%` }}
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
            </div>
          )}
          <div
            className="h-full bg-green-500"
            style={{ width: `${bonusPercentage}%` }}
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
          </div>
          {projectedXP > 0 && (
            <div
              className="h-full bg-purple-500"
              style={{ width: `${projectedPercentage}%` }}
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
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex text-xs  justify-between sm:justify-start space-x-4 mx-1">
        <span className="text-primary">
          <span className="mr-1 font-normal">Previous:</span>
          {currentXP}
        </span>
        <span className="text-green-500">
          <span className="mr-1 font-normal">Bonus:</span>
          {bonusXP}
        </span>
        <span className={projectedXP < 0 ? "text-red-500" : "text-purple-500"}>
          <span className="mr-1 font-normal">Today:</span>
          {projectedXP}
        </span>
      </div>
    </div>
  );
}
