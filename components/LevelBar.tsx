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

function LevelBar({ xp }: { xp: number }) {
  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const progressPercentage = ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const currentXpForCurrentLevel = xp - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="tracking-tight">Lvl {level}</h3>
        <div className="flex items-center">
          {currentXpForCurrentLevel} / {xpToLevelUp}
          <span className="flex items-center ml-2">
            <FaBoltLightning />
          </span>
        </div>
      </div>
      <Progress value={progressPercentage} className="mt-2" />
    </div>
  );
}

export default LevelBar;
