"use client";

import React from "react";
import { motion } from "framer-motion";
import { JOURNAL_COLORS } from "@lib/colors";

interface DisciplineLevelBarProps {
  currentXP: number;
  nextLevelXP: number;
  xpGain?: number;
  className?: string;
}

export function DisciplineLevelBar({
  currentXP,
  nextLevelXP,
  xpGain = 0,
  className = "",
}: DisciplineLevelBarProps) {
  // Calculate percentages
  const currentPercentage = Math.max(
    0,
    Math.min(100, (currentXP / nextLevelXP) * 100)
  );
  const xpGainPercentage = Math.max(
    0,
    Math.min(100 - currentPercentage, (xpGain / nextLevelXP) * 100)
  );

  return (
    <div
      className={`w-full h-4 bg-muted rounded-full overflow-hidden ${className}`}
    >
      <div className="h-full flex relative">
        {/* XP Fill */}
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${currentPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          role="progressbar"
          aria-valuenow={currentPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        {/* Projected XP */}
        {xpGain > 0 && (
          <motion.div
            className={`h-full bg-${JOURNAL_COLORS.score} absolute top-0`}
            initial={{ width: 0 }}
            animate={{ width: `${xpGainPercentage}%` }}
            style={{ left: `${currentPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            role="progressbar"
            aria-valuenow={xpGainPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
      </div>
    </div>
  );
}
