import { IconRenderer } from "@components/IconRenderer";
import { LevelIndicator } from "@components/ui/level-indicator";
import { CircularProgress } from "@components/ui/circular-progress";
import { XpDisplay } from "@components/ui/xp-display";
import { Badge } from "@components/ui/badge";
import {
  calculateHabitLevel,
  xpForHabitLevel,
  getHabitRarity,
} from "@lib/level";

interface HabitIconProgressBarProps {
  icon: string;
  xp: number;
  projectedXp?: number;
  displayXpValues?: boolean;
  displayLevelValues?: boolean;
  displaySmall?: boolean;
  name?: string;
}

export function HabitIconProgressBar({
  icon,
  xp,
  projectedXp = 0,
  displayXpValues = false,
  displayLevelValues = false,
  displaySmall = false,
  name,
}: HabitIconProgressBarProps) {
  // NOTE: this part is consistent in all progress bars
  // Should be integrated in util function?
  // Calculate XP and level_PATTERN
  // ===============================================================
  const xpGain = xp + projectedXp;
  const level = calculateHabitLevel(xpGain);
  const currentLevel = calculateHabitLevel(xp);
  const { baseXP, nextLevelXP } = xpForHabitLevel(level);
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

  // const progressBarWidth = displayXpValues ? "[100px]" : "[70px]";

  const { bg: bgColor, icon: textColor, label } = getHabitRarity(level);

  return (
    <div className="flex flex-col items-center">
      {displaySmall && (
        <div className="text-xs mb-1 text-center">
          <span className="text-muted-foreground">Level</span>
          <span className="px-1 font-extrabold">{level}</span>
        </div>
      )}
      <div className={`relative h-full flex items-center justify-center`}>
        <div className="relative">
          {/*LEVEL BAR*/}
          <CircularProgress
            className="overflow-hidden"
            value={currentProgressPercentage}
            xpGainValue={xpGainProgressPercentage}
            strokeWidth={displaySmall ? 6 : 7.3}
            circleSize={displaySmall ? 50 : 73}
            projectedXp={projectedXp}
          />
          {/*ICON*/}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ pointerEvents: "none" }}
          >
            <IconRenderer
              iconName={icon}
              className="bg-transparent"
              size={displaySmall ? 25 : 35}
              xp={xpGain}
            />
          </div>
        </div>

        {displayLevelValues && (
          <>
            {/*LEVEL*/}
            <Badge
              variant="secondary"
              className="rounded-full absolute top-0 right-24"
            >
              <span className="mr-1">Level</span>
              {level}
              <LevelIndicator currentLevel={currentLevel} level={level} />
            </Badge>
            {/*HABIT RARITY*/}
            <Badge
              className={`${bgColor} hover:bg-${bgColor} rounded-full absolute top-0 left-24`}
            >
              <span className={`${textColor}`}>{label}</span>
            </Badge>
          </>
        )}

        {displayXpValues && (
          <>
            {/*CURRENT XP VS NEXT LEVEL XP*/}
            <Badge
              variant="secondary"
              className="rounded-full absolute bottom-0 right-24"
            >
              <span className="textColor">
                {xpForCurrentLevel}/{xpToLevelUp}
              </span>

              <span className="ml-1">XP</span>
            </Badge>

            {/*PROJECTED XP*/}
            <Badge
              variant="outline"
              className="rounded-full bg-primary-foreground absolute bottom-0 left-24 flex items-center space-x-1 px-3 py-1"
            >
              <XpDisplay xpValue={projectedXp} />
              <span className="whitespace-nowrap">XP Today</span>
            </Badge>
          </>
        )}
      </div>

      {displaySmall && (
        <div className="text-xs mt-2 text-center truncate max-w-full sm:px-2">
          {name}
        </div>
      )}
    </div>
  );
}
