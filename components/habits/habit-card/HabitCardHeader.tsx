import { IconRenderer } from "@components/IconRenderer";
import { ActionIcon } from "@components/habits/habit-actions/HabitActionIcons";
import { CircularProgress } from "@components/ui/circular-progress";
import { calculateLevel, xpForLevel } from "@lib/level";
import { formatNumberSuffixes } from "@lib/utils";
import { Habit } from "@app/types/types";

type HabitCardHeaderProps = {
  habit: Habit;
  actionUpdateValues: { [key: string]: number };
  todayEntryLoading: boolean;
};

export function HabitCardHeader({
  habit,
  actionUpdateValues,
  todayEntryLoading,
}: HabitCardHeaderProps) {
  const { name, icon, xp } = habit;

  const projectedXp = Object.values(actionUpdateValues).reduce(
    (sum, value) => sum + value,
    0
  );

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

  return (
    <div className="p-2 px-4 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center">
          <IconRenderer iconName={icon} className="h-16 w-16 p-1" xp={xp} />
        </div>

        <div className="px-4 flex flex-col justify-center">
          <span>{name}</span>

          <div className="text-muted-foreground flex items-center">
            <div className="font-semibold text-sm text-muted-foreground">
              Level
              <span
                className={`ml-1 ${
                  currentLevel === level ? "text-primary" : "text-green-500"
                }`}
              >
                {level}
              </span>
            </div>
            <span className="mx-2 text-muted text-lg">|</span>
            <div className="font-normal text-sm text-muted-foreground">
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
                  size={20}
                  dailyTargetCompleted={
                    actionUpdateValues[action.id] >= action.dailyTarget
                  }
                />
              </div>
            ))}
          </div>
          {/* <div className="text-sm text-muted-foreground">
            Level
            <span
              className={`ml-1 ${
                currentLevel === level ? "text-primary" : "text-green-500"
              }`}
            >
              {level}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatNumberSuffixes(xpForCurrentLevel)}/
            {formatNumberSuffixes(xpToLevelUp)}
            <span className="text-primary ml-1">XP</span>
          </div> */}
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
