import { IconRenderer } from "@components/IconRenderer";
import { ActionIcon } from "@components/habits/habit-actions/HabitActionIcons";
import { HabitLevelUpIndicator } from "@components/habits/HabitLevelUpIndicator";
import { CircularProgress } from "@components/ui/circular-progress";
import { calculateHabitLevel, xpForHabitLevel } from "@lib/level";
import { formatNumberSuffixes } from "@lib/utils";
import { Habit } from "@app/types/types";

type HabitCardHeaderProps = {
  habit: Habit;
  actionUpdateValues: { [key: string]: number };
  todayEntryLoading: boolean;
  willpowerMultiplier: number;
};

export function HabitCardHeader({
  habit,
  actionUpdateValues,
  todayEntryLoading,
  willpowerMultiplier,
}: HabitCardHeaderProps) {
  const { name, icon, xp } = habit;

  // Calculate projected XP with willpower multiplier
  const projectedXp = Math.round(
    Object.values(actionUpdateValues).reduce((sum, value) => sum + value, 0) *
      willpowerMultiplier
  );

  // Calculate XP and level
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

  return (
    <div className="p-2 px-3 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center">
          <IconRenderer
            iconName={icon}
            className="rounded-md h-16 w-16 p-1"
            xp={xpGain}
            isXpLoading={todayEntryLoading}
          />
        </div>

        <div className="pl-4 flex flex-col justify-center">
          <span>{name}</span>

          <div className="text-muted-foreground flex items-center">
            <div className="font-semibold text-sm text-muted-foreground flex items-center">
              Level
              <span className="ml-1 flex items-center text-primary">
                {level}
              </span>
              <HabitLevelUpIndicator
                currentLevel={currentLevel}
                level={level}
              />
            </div>
            <span className="mx-1 text-muted text-lg">|</span>
            <div className="font-normal text-xs text-muted-foreground">
              {formatNumberSuffixes(xpForCurrentLevel)}/
              {formatNumberSuffixes(xpToLevelUp)}
              <span className="text-primary ml-1">XP</span>
            </div>
          </div>
          <div className="flex items-center my-1">
            {habit.actions.map((action) => (
              <div key={action.id}>
                <ActionIcon
                  type={action.type}
                  size={18}
                  dailyTargetCompleted={
                    actionUpdateValues[action.id] >= action.dailyTarget
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center h-full w-full">
          <CircularProgress
            className="ml-4"
            value={currentProgressPercentage}
            xpGainValue={xpGainProgressPercentage}
            strokeWidth={6}
            circleSize={73}
          />
          <div className="absolute w-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center text-xs">
              {todayEntryLoading ? (
                <div className="text-muted">
                  <span className="text-base">??</span>
                  <span className="">XP</span>
                </div>
              ) : projectedXp > 0 ? (
                <div>
                  <span className="text-base text-green-500 font-bold">
                    +{formatNumberSuffixes(projectedXp)}
                  </span>
                  <span className="">XP</span>
                </div>
              ) : (
                <div>
                  <span className="text-base">??</span>
                  <span className="">XP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
