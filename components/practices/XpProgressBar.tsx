import React from "react";
import { motion } from "framer-motion";
import { LevelIndicator } from "@components/ui/level-indicator";
import { calculateDisciplineLevel, xpForDisciplineLevel } from "@lib/level";
import { JOURNAL_COLORS, getRuntimeColorProps } from "@lib/colors";

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
            className={`h-full absolute top-0 ${
              getRuntimeColorProps(color, "bg").className ?? ""
            }`}
            style={getRuntimeColorProps(color, "bg").style}
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

type XpProgressBarProps = {
  xp: number;
  projectedXp: number;
  name: string;
  showXpMetrics?: boolean;
  height?: number;
  color?: string;
  textColor?: string;
};

export const XpProgressBar = ({
  xp,
  projectedXp,
  name,
  showXpMetrics = false,
  height = 4,
  color,
  textColor = "text-primary",
}: XpProgressBarProps) => {
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

  return (
    <div className="w-full">
      {/* Show name only when showXpMetrics is true */}
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
          <div className="relative w-full">
            <ProgressBar
              currentProgressPercentage={currentProgressPercentage}
              xpGainProgressPercentage={xpGainProgressPercentage}
              showBaseXpBar={currentLevel === level}
              height={height}
              color={color}
            />

            <div className="absolute inset-0 pointer-events-none">
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

          <div className="flex justify-center items-center">
            <LevelIndicator
              currentLevel={currentLevel}
              level={level}
              positiveColor={color ? color : "primary"}
              size={25}
            />
          </div>
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
