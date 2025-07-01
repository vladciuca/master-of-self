import React from "react";
import { motion } from "framer-motion";
import { LevelIndicator } from "@components/ui/level-indicator";
import { calculateDisciplineLevel, xpForDisciplineLevel } from "@lib/level";
import { JOURNAL_COLORS } from "@lib/colors";

function ProgressBar({
  currentProgressPercentage,
  xpGainProgressPercentage,
  showBaseXpBar,
  height = 4,
  color = "primary",
}: {
  currentProgressPercentage: number;
  xpGainProgressPercentage: number;
  showBaseXpBar: boolean;
  height?: number;
  color?: string;
}) {
  return (
    <div
      className={`w-full min-h-2 h-${height} bg-muted rounded-full overflow-hidden`}
    >
      <div className="h-full flex relative">
        {/* XP Fill */}
        <motion.div
          className={`h-full bg-${JOURNAL_COLORS.score}`}
          initial={{ width: 0 }}
          animate={{ width: `${xpGainProgressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          role="progressbar"
          aria-valuenow={xpGainProgressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {showBaseXpBar && (
          <motion.div
            className={`h-full bg-${color} absolute top-0`}
            initial={{ width: 0 }}
            animate={{ width: `${currentProgressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            role="progressbar"
            aria-valuenow={currentProgressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
      </div>
    </div>
  );
}

type DisciplineProgressBarProps = {
  xp: number;
  projectedXp: number;
  name: string;
  showXpMetrics?: boolean;
  height?: number;
  color?: string;
  textColor?: string;
};

export const DisciplineProgressBar = ({
  xp,
  projectedXp,
  name,
  showXpMetrics = false,
  height = 4,
  color,
  textColor = "text-primary",
}: DisciplineProgressBarProps) => {
  // Calculate XP and level
  const xpGain = xp + projectedXp;
  const level = calculateDisciplineLevel(xpGain);
  const currentLevel = calculateDisciplineLevel(xp);
  const { baseXP, nextLevelXP } = xpForDisciplineLevel(level);
  const currentProgressPercentage = Math.min(
    ((xp - baseXP) / (nextLevelXP - baseXP)) * 100,
    100
  );
  const xpGainProgressPercentage = Math.min(
    ((xpGain - baseXP) / (nextLevelXP - baseXP)) * 100,
    100
  );
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;
  const leveledUp = level > currentLevel;
  // const isBarXpEmpty = currentProgressPercentage === 0;

  return (
    <div className="w-full">
      {/* Show discipline name only when showXpMetrics is true */}
      {showXpMetrics && (
        <div className="flex justify-between items-center">
          <div className="flex items-baseline capitalize mb-1">
            <span className="text-primary">{name}</span>
            <LevelIndicator
              currentLevel={currentLevel}
              level={level}
              positiveColor={color ? color : "primary"}
              size={16}
            />
          </div>

          {projectedXp > 0 && (
            <div
              className={`text-${JOURNAL_COLORS.score} font-semibold text-lg flex-shrink-0`}
            >
              +{projectedXp}
            </div>
          )}
        </div>
      )}

      {!showXpMetrics ? (
        <div
          className={`grid grid-cols-[1fr_auto_auto] gap-1 items-center pl-1`}
        >
          {/* Col 1: Progress Bar with Overlay Text (flexible width column) */}
          <div className="relative w-full">
            <ProgressBar
              currentProgressPercentage={currentProgressPercentage}
              xpGainProgressPercentage={xpGainProgressPercentage}
              showBaseXpBar={currentLevel === level}
              height={height}
              color={color}
            />

            {/* Overlay text */}
            {/* <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full px-3">
                <div
                  className={`w-full flex justify-between items-center ${
                    isBarXpEmpty || leveledUp ? "text-primary" : textColor
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`capitalize font-medium 
                        ${
                          isBarXpEmpty || leveledUp ? "text-primary" : textColor
                        }
                        text-md"
                      `}
                    >
                      {name}
                    </span>
                    <div className={`ml-1 text-xs`}>
                      ({xpForCurrentLevel}/{xpToLevelUp})
                    </div>
                  </div>
                  <span
                    className={`flex items-baseline ${
                      xpGainProgressPercentage < 75 || leveledUp
                        ? "text-primary"
                        : textColor
                    }
                    text-sm`}
                  >
                    Rank
                    <span
                      className={`ml-1 flex items-center font-semibold 
                        text-lg`}
                    >
                      {level}
                    </span>
                  </span>
                </div>
              </div>
            </div> */}

            <div className="absolute inset-0 pointer-events-none">
              {/* Filled text (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${xpGainProgressPercentage}%` }}
              >
                <div
                  className="flex justify-between items-center h-full px-3 text-background whitespace-nowrap"
                  style={{
                    width: `${100 / (xpGainProgressPercentage / 100)}%`,
                  }}
                >
                  <div
                    className="flex items-center min-w-0"
                    style={{ maxWidth: "75%" }}
                  >
                    <span className="font-medium capitalize truncate">
                      {name}
                    </span>
                    <span className="ml-1 text-xs flex-shrink-0">
                      ({xpForCurrentLevel}/{xpToLevelUp})
                    </span>
                  </div>
                  <span className="font-semibold flex-shrink-0">
                    Rank {level}
                  </span>
                </div>
              </div>

              {/* Base text (unfilled area) */}
              <div className="flex justify-between items-center h-full px-3 text-primary whitespace-nowrap">
                <div
                  className="flex items-center min-w-0"
                  style={{ maxWidth: "75%" }}
                >
                  <span className="font-medium capitalize truncate">
                    {name}
                  </span>
                  <span className="ml-1 text-xs flex-shrink-0">
                    ({xpForCurrentLevel}/{xpToLevelUp})
                  </span>
                </div>
                <span className="font-semibold flex-shrink-0">
                  Rank {level}
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Level Indicator (fixed width column) */}
          <div className="flex justify-center items-center">
            <LevelIndicator
              currentLevel={currentLevel}
              level={level}
              positiveColor={color ? color : "primary"}
              size={25}
            />
          </div>
          {/* Col 3: Projected XP (fixed width column that's always present) */}
          <div
            className={`text-${JOURNAL_COLORS.score} font-semibold text-lg
             flex justify-end`}
          >
            {projectedXp > 0 && `+${projectedXp}`}
          </div>
        </div>
      ) : (
        <div className="relative">
          <ProgressBar
            currentProgressPercentage={currentProgressPercentage}
            xpGainProgressPercentage={xpGainProgressPercentage}
            showBaseXpBar={currentLevel === level}
            height={height}
            color={color}
          />

          <div className="flex items-center justify-between text-muted-foreground text-xs mt-2">
            <div className="flex items-center">
              <span>Rank</span>
              <span className="ml-1 flex items-center text-primary">
                {level}
              </span>
            </div>
            <div>
              <span className="textColor">
                {xpForCurrentLevel}/{xpToLevelUp}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
