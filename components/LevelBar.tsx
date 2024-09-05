"use client";

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
  xpChange?: number;
  icon?: JSX.Element;
};

function LevelBar({ xp, xpChange = 0, icon }: LevelBarProps) {
  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const currentXpForCurrentLevel = xp - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  const currentProgressPercentage =
    (currentXpForCurrentLevel / xpToLevelUp) * 100;
  const xpChangePercentage = (xpChange / xpToLevelUp) * 100;

  const hasXpChange = () => {
    if (xpChange > 0) {
      return <span className="text-green-500 font-bold mx-1">+{xpChange}</span>;
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <h3 className="tracking-normal text-muted-foreground">
          {icon && <span className="mr-2">{icon}</span>}
          LVL
          <span className="font-bold ml-1 text-foreground">{level}</span>
        </h3>
        <div className="flex items-baseline">
          {currentXpForCurrentLevel}
          {hasXpChange()} / {xpToLevelUp}
          <FaBoltLightning className="ml-1" />
        </div>
      </div>
      <div className="relative mt-2 h-3 bg-secondary rounded-full overflow-hidden">
        {xpChange > 0 && (
          <div
            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 ease-in-out rounded-full"
            style={{
              width: `${currentProgressPercentage + xpChangePercentage}%`,
            }}
          />
        )}
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${currentProgressPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default LevelBar;
