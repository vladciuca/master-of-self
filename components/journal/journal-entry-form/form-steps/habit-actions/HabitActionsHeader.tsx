import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import { calculateLevel, xpForLevel } from "@lib/level";
import { Habit } from "@app/types/types";

type HabitCardHeaderProps = {
  habit: Habit;
  projectedHabitXp: number;
};

export function HabitActionsHeader({
  habit,
  projectedHabitXp,
}: HabitCardHeaderProps) {
  const { name, icon, xp } = habit;

  const xpGain = xp + projectedHabitXp;
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
    <div className="p-2 px-4 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center">
          <IconRenderer iconName={icon} className="text-6xl" xp={xp} />
        </div>
        <div className="px-4 flex flex-col justify-center">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {name}
          </h4>
          <div className="text-sm text-muted-foreground flex items-center">
            Level {level}
            <span className="mx-2 text-primary font-extralight text-2xl">
              |
            </span>
            {xpForCurrentLevel}/{xpToLevelUp}
          </div>
          <div className="text-sm text-muted-foreground"></div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center h-full w-full">
          <CircularProgress
            className="ml-4"
            value={currentProgressPercentage}
            xpGainValue={xpGainProgressPercentage}
            strokeWidth={6}
            circleSize={70}
          />
          <div
            className="absolute w-full flex flex-col"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="flex flex-col items-center justify-center text-xs"
              style={{ pointerEvents: "none" }}
            >
              <div className="text-green-500">
                +{projectedHabitXp}
                <span className="text-primary ml-1">XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
