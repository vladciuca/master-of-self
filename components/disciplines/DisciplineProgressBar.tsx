"use client";

import React from "react";
import { color, motion } from "framer-motion";
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
};

export function DisciplineProgressBar({
  xp,
  projectedXp,
  name,
  showXpMetrics = false,
  height,
  color,
}: DisciplineProgressBarProps) {
  // Calculate XP and level_PATTERN
  // ===============================================================
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
  // ===============================================================

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline capitalize mb-1">
          <span className="text-primary">{name}</span>

          <LevelIndicator
            currentLevel={currentLevel}
            level={level}
            // positiveColor={JOURNAL_COLORS.score}
            positiveColor={color}
            size={16}
          />
        </div>

        <div className="flex items-center">
          {projectedXp > 0 && (
            <div
              className={`text-${JOURNAL_COLORS.score} font-semibold text-lg`}
            >
              +{projectedXp}
            </div>
          )}
        </div>
      </div>

      {!showXpMetrics && (
        <div className="absolute z-10 ml-3 mt-1 w-[76%] sm:w-[72%]">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-baseline">
              <span>Rank</span>
              <span className="ml-1 flex items-center text-primary text-2xl font-bold">
                {level}
              </span>
            </div>
            <div className="text-sm">
              {xpForCurrentLevel}/{xpToLevelUp}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <ProgressBar
          currentProgressPercentage={currentProgressPercentage}
          xpGainProgressPercentage={xpGainProgressPercentage}
          showBaseXpBar={currentLevel === level}
          height={height}
          color={color}
        />
      </div>

      {showXpMetrics && (
        <div className="flex items-center justify-between text-muted-foreground text-xs mt-2">
          <div className="flex items-center">
            <span>Rank</span>
            <span className="ml-1 flex items-center text-primary">{level}</span>
          </div>
          <div>
            <span className="textColor">
              {xpForCurrentLevel}/{xpToLevelUp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
