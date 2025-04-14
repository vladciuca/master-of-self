import { IconRenderer } from "@components/IconRenderer";
import { ActionIcon } from "@components/habits/habit-actions/HabitActionIcons";
import { LevelIndicator } from "@components/ui/level-indicator";
import { CircularProgress } from "@components/ui/circular-progress";
import { XpDisplay } from "@components/ui/xp-display";
import { calculateHabitLevel, xpForHabitLevel } from "@lib/level";
import { formatNumberSuffixes } from "@lib/utils";
import { isDailyTargetCompleted, isActionOverCapped } from "@lib/score";
import { applyWillpowerBonus } from "@lib/level";
import type { Habit, JournalEntryHabitActions } from "@models/types";

type HabitCardHeaderProps = {
  habit: Habit;
  entryLoading: boolean;
  habitDefaultActionValues: JournalEntryHabitActions;
  habitActionValues: JournalEntryHabitActions;
  entryTotalWillpower: number;
  hasNoEntryToday: boolean;
};

export function HabitCardHeader({
  habit,
  entryLoading,
  habitDefaultActionValues,
  habitActionValues,
  entryTotalWillpower,
  hasNoEntryToday,
}: HabitCardHeaderProps) {
  const { name, icon, xp: habitXp } = habit;

  //habit ->
  // Calculate default projected XP for Habits
  const baseDefaultHabitXpFromActions = Object.values(
    habitDefaultActionValues
  ).reduce((sum, value) => sum + value, 0);
  //WE DO NOT WANT TO APPLY WPx to Projected values if hasNoEntryToday
  const defaultProjectedXp = baseDefaultHabitXpFromActions;

  //last entry ->
  // Calculate projected XP from last entry Action Values
  const baseHabitXpFromActions = Object.values(habitActionValues).reduce(
    (sum, value) => sum + value,
    0
  );
  const projectedHabitXp = applyWillpowerBonus(
    baseHabitXpFromActions,
    entryTotalWillpower
  );

  //xp = xp
  let xp = habitXp;
  //projected xp = projected xp
  let projectedXp = projectedHabitXp;

  // If there is no todayEntry, we add
  if (hasNoEntryToday) {
    //xp = xp + projected xp
    xp = xp + projectedXp;
    //projected xp = habit default xp || 0
    projectedXp = defaultProjectedXp;
  }

  // if habitActionValues from today's Journal Entry is an empty {} need to use defaultValues with WPx
  if (!hasNoEntryToday && Object.keys(habitActionValues).length === 0) {
    const defaultProjectedXpForExistingEntryToday = applyWillpowerBonus(
      baseDefaultHabitXpFromActions,
      entryTotalWillpower
    );
    projectedXp = defaultProjectedXpForExistingEntryToday;
  }

  // NOTE: code pattern is present before any progress bar
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

  return (
    <div className="p-2 px-3 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center justify-center">
          <IconRenderer
            iconName={icon}
            className="rounded-md h-16 w-16 p-1"
            xp={xpGain}
            isXpLoading={entryLoading}
            size={50}
          />
        </div>

        <div className="pl-4 flex flex-col justify-center">
          <span>{name}</span>

          <div className="text-muted-foreground flex items-center">
            <div className="text-xs text-muted-foreground flex items-center">
              Level
              <span className="ml-1 flex items-center text-primary">
                {level}
              </span>
              <LevelIndicator currentLevel={currentLevel} level={level} />
            </div>
            <span className="mx-1 text-muted text-lg">|</span>
            <div className="text-xs text-muted-foreground">
              {formatNumberSuffixes(xpForCurrentLevel)}/
              {formatNumberSuffixes(xpToLevelUp)}
              <span className="text-primary ml-1">XP</span>
            </div>
          </div>
          <div className="flex items-center my-1 space-x-2">
            {habit.actions.map((action) => {
              const actionParams = {
                value: hasNoEntryToday
                  ? habitDefaultActionValues[action.id]
                  : habitActionValues[action.id],
                dailyTarget: action.dailyTarget,
                isActionBreak: action.type === "break",
              };

              const dailyTargetCompleted = isDailyTargetCompleted(actionParams);

              const isDailyOverCapped = isActionOverCapped(actionParams);

              return (
                <div key={action.id}>
                  <ActionIcon
                    type={action.type}
                    size={18}
                    dailyTargetCompleted={dailyTargetCompleted}
                    overCapped={isDailyOverCapped}
                  />
                </div>
              );
            })}
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
            projectedXp={projectedXp}
          />
          <div className="absolute w-full flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center text-xs">
              {entryLoading ? (
                <div className="text-muted">
                  <span className="text-base">??</span>
                  <span>XP</span>
                </div>
              ) : (
                <div>
                  <span className="text-base">
                    <XpDisplay xpValue={projectedXp} />
                  </span>
                  <span>XP</span>
                </div>
              )}
              {/* NOTE: this is a string but <XpDisplay/> accepts only numbers
              This needs to be used if the XP value is to big and clips the XP circle
              {formatNumberSuffixes(lastEntryProjectedXp)} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
