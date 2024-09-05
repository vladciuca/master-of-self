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

type LevelBarProps = {
  xp: number;
  icon?: JSX.Element;
};

function LevelBar({ xp, icon }: LevelBarProps) {
  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const progressPercentage = ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const currentXpForCurrentLevel = xp - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <h3 className="tracking-normal text-muted-foreground">
          {icon && <span className="mr-2">{icon}</span>}
          LVL
          <span className="font-bold ml-1 text-foreground">{level}</span>
        </h3>
        <div className="flex items-center">
          {currentXpForCurrentLevel} / {xpToLevelUp}
          <FaBoltLightning className="ml-1" />
        </div>
      </div>
      <Progress value={progressPercentage} className="mt-2 h-3" />
    </div>
  );
}

export default LevelBar;
