import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import { Badge } from "@components/ui/badge";
import { calculateLevel, xpForLevel } from "@lib/level";

interface HabitProgressBarProps {
  icon: string;
  xp: number;
  projectedXp: number;
  displayXpValues?: boolean;
  // currentProgressPercentage?: number;
  // xpGainProgressPercentage?: number;
}

export function HabitProgressBar({
  icon,
  xp,
  projectedXp,
  displayXpValues = false,
}: // currentProgressPercentage,
// xpGainProgressPercentage,
HabitProgressBarProps) {
  // Calculate XP and level
  const xpGain = xp + projectedXp;
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

  const progressBarWidth = displayXpValues ? "[100px]" : "[70px]";

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
      {displayXpValues && (
        <>
          {/*LEVEL*/}
          <Badge
            variant="secondary"
            className="rounded-full absolute top-0 right-24"
          >
            <span className="mr-1">Lvl</span>
            {level}
          </Badge>
          {/*CURRENT XP VS NEXT LEVEL XP*/}
          <Badge
            variant="secondary"
            className="rounded-full absolute bottom-0 right-24"
          >
            <span className="text-muted-foreground">
              {xpForCurrentLevel}/{xpToLevelUp}
            </span>

            <span className="ml-1">XP</span>
          </Badge>
          {/*PROJECTED XP*/}
          <Badge
            variant="outline"
            className="rounded-full bg-primary-foreground absolute bottom-0 left-24"
          >
            {projectedXp > 0 ? (
              <span className="text-green-500 font-bold mr-1">
                +{projectedXp}
              </span>
            ) : (
              <span className="text-muted-foreground font-bold mr-1">
                {projectedXp}
              </span>
            )}
            XP
          </Badge>
        </>
      )}
    </div>
  );
}
