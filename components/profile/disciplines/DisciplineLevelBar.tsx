"use client";

import React from "react";
import { motion } from "framer-motion";
import { LevelIndicator } from "@components/ui/level-indicator";
import { calculateDisciplineLevel, xpForDisciplineLevel } from "@lib/level";

import { JOURNAL_COLORS } from "@lib/colors";

function ProgressBar({
  currentProgressPercentage,
  xpGainProgressPercentage,
  showBaseXpBar,
}: {
  currentProgressPercentage: number;
  xpGainProgressPercentage: number;
  showBaseXpBar: boolean;
}) {
  return (
    <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
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
            className="h-full bg-primary absolute top-0"
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

interface DisciplineLevelBarProps {
  xp: number;
  projectedXp: number;
  name: string;
}

export function DisciplineLevelBar({
  xp,
  projectedXp,
  name,
}: DisciplineLevelBarProps) {
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
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center capitalize text-lg font-semibold">
          {name}
          <LevelIndicator
            currentLevel={currentLevel}
            level={level}
            positiveColor={JOURNAL_COLORS.score}
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

      <ProgressBar
        currentProgressPercentage={currentProgressPercentage}
        xpGainProgressPercentage={xpGainProgressPercentage}
        showBaseXpBar={currentLevel === level}
      />
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <div className="flex items-center">
          <span className="mr-1">Rank</span>
          {level}
        </div>
        <div>
          <span className="textColor">
            {xpForCurrentLevel}/{xpToLevelUp}
          </span>
        </div>
      </div>
    </div>
  );
}
