"use client";

import CircularProgress from "@components/ui/circular-progress";
import { calculateLevel, xpForLevel } from "@utils/level";
import { FaBoltLightning } from "react-icons/fa6";

type LevelBarXpGainProps = {
  xp: number;
  xpChange?: number;
  icon?: JSX.Element;
  name?: string;
};

function XpGainLevelBar({ xp, xpChange = 0, icon, name }: LevelBarXpGainProps) {
  const xpGain = xp + xpChange;
  const level = calculateLevel(xpGain);
  const { baseXP, nextLevelXP } = xpForLevel(level);
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

  return (
    <div className="p-2 flex justify-center text-start">
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center h-full w-full">
          <CircularProgress
            className="ml-4"
            value={currentProgressPercentage}
            xpGainValue={xpGainProgressPercentage}
            strokeWidth={10}
            circleSize={150}
          />
          <div
            className="absolute w-full flex flex-col"
            style={{
              pointerEvents: "none", // Ensure text does not block interactions
            }}
          >
            <div className="w-full flex items-center justify-center mb-2">
              <span className="text-3xl">{icon}</span>
              {xpChange !== undefined && xpChange > 0 && (
                <div className="flex items-center ml-1">
                  <span className="text-green-500 font-semibold text-xl">
                    +{xpChange}
                  </span>
                  <span className="ml-1">
                    <FaBoltLightning />
                  </span>
                </div>
              )}
            </div>
            <div className="text-center text-sm font-semibold">
              {xpForCurrentLevel} / {xpToLevelUp}
            </div>
            <div className="text-center text-xs text-muted-foreground font-semibold">
              Level {level}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default XpGainLevelBar;
