import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import { Badge } from "@components/ui/badge";
import { PiArrowFatLinesUpFill } from "react-icons/pi";
import { calculateLevel, xpForLevel, getHabitRarity } from "@lib/level";

interface HabitIconProgressBarProps {
  icon: string;
  xp: number;
  projectedXp?: number; //temp
  displayXpValues?: boolean;
  displayLevelValues?: boolean;
}

export function HabitIconProgressBar({
  icon,
  xp,
  projectedXp = 0, //temp
  displayXpValues = false,
  displayLevelValues = false,
}: HabitIconProgressBarProps) {
  // Calculate XP and level
  const xpGain = xp + projectedXp;
  const level = calculateLevel(xpGain);
  const currentLevel = calculateLevel(xp);
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

  const progressBarWidth = displayXpValues ? "[100px]" : "[70px]";

  const { bg: bgColor, icon: textColor, label } = getHabitRarity(level);

  // console.log("====", habitRarityLevel);

  return (
    <div
      className={`relative flex items-center justify-center h-full w-${progressBarWidth}`}
    >
      {/*LEVEL BAR*/}
      <CircularProgress
        className="ml-4"
        value={currentProgressPercentage}
        xpGainValue={xpGainProgressPercentage}
        strokeWidth={6}
        circleSize={70}
      />
      {/*ICON*/}
      <div
        className="absolute w-full flex flex-col"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center justify-center text-xs"
          style={{ pointerEvents: "none" }}
        >
          <div className="-z-10">
            <IconRenderer
              iconName={icon}
              className="text-4xl rounded-full bg-transparent"
              xp={xp}
            />
          </div>
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
            {currentLevel < level && (
              <PiArrowFatLinesUpFill className="text-green-500 ml-1" />
            )}
          </Badge>
          {/*HABIT RARITY*/}
          <Badge className={`${bgColor} rounded-full absolute top-0 left-24`}>
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
            {projectedXp > 0 ? (
              <span className="text-green-500 font-bold">+{projectedXp}</span>
            ) : (
              <span className="text-muted-foreground font-bold">
                {projectedXp}
              </span>
            )}
            <span className="whitespace-nowrap">XP Today</span>
          </Badge>
        </>
      )}
    </div>
  );
}
