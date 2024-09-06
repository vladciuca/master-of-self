"use client";

import { Progress } from "@components/ui/progress";
import { FaBoltLightning } from "react-icons/fa6";

function xpForLevel(level: number) {
  let baseXP = 0;
  let xpRequired = 10;

  for (let i = 1; i < level; i++) {
    baseXP += xpRequired;
    xpRequired += 5;
  }

  return { baseXP, nextLevelXP: baseXP + xpRequired };
}

function calculateLevel(xp: number) {
  let level = 1;

  while (true) {
    const { nextLevelXP } = xpForLevel(level);
    if (xp < nextLevelXP) {
      return level;
    }
    level++;
  }
}

type LevelBarXpGainProps = {
  xp: number;
  xpChange?: number;
  icon?: JSX.Element;
};

function LevelBarXpGain({ xp, xpChange = 0, icon }: LevelBarXpGainProps) {
  const xpGain = xp + xpChange;
  const level = calculateLevel(xpGain);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const currentProgressPercentage =
    ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const xpGainProgressPercentage =
    ((xpGain - baseXP) / (nextLevelXP - baseXP)) * 100;
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  return (
    <div>
      <div className="grid grid-cols-3 items-baseline text-sm">
        <h3 className="tracking-normal text-muted-foreground flex items-baseline justify-start uppercase">
          {"Level"}
          <span className="font-bold ml-1 text-foreground">{level}</span>
        </h3>
        <div className="flex flex-grow items-baseline justify-center text-2xl">
          <div>{icon}</div>
          <div className="text-green-500 font-semibold ml-1">
            {xpChange > 0 ? `+${xpChange}` : null}
          </div>
        </div>

        <div className="flex items-baseline justify-end">
          {xpForCurrentLevel} / {xpToLevelUp}
          <FaBoltLightning className="ml-1" />
        </div>
      </div>
      <div className="relative mt-2 h-6 overflow-hidden">
        <Progress
          value={xpGainProgressPercentage}
          className="absolute top-0 left-0 h-full"
          bgFillColor="#4ade80"
        />

        <Progress
          value={currentProgressPercentage}
          className="bg-transparent absolute top-0 left-0 h-full"
        />
      </div>
    </div>
  );
}

export default LevelBarXpGain;
