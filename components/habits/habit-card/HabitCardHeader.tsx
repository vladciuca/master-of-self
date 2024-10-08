import { useState, useEffect } from "react";
import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import { calculateLevel, xpForLevel } from "@lib/level";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { Habit } from "@app/types/types";
import { Plus } from "lucide-react";

type HabitCardHeaderProps = {
  habit: Habit;
  handleOpenHabitActions: (e: React.MouseEvent) => void;
};

export function HabitCardHeader({
  habit,
  handleOpenHabitActions,
}: HabitCardHeaderProps) {
  const { name, icon, xp, _id: habitId } = habit;

  // Initialize actionValues state
  const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
    {}
  );
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();

  // Calculate projected XP gain
  const projectedXp = Object.values(actionValues).reduce(
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

  // Update actionValues when todayEntry changes
  useEffect(() => {
    if (!todayEntryLoading && todayEntry?.nightEntry?.actions) {
      // Initialize actionValues with values from todayEntry
      const initialValues = todayEntry.nightEntry.actions[habitId] || {};
      setActionValues(initialValues);
    }
  }, [todayEntry, todayEntryLoading, habitId]);

  return (
    <div className="p-2 px-4 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center">
          <IconRenderer iconName={icon} className="h-16 w-16 p-1" xp={xp} />
        </div>
        <div className="px-4 flex flex-col justify-center">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {name}
          </h4>
          <div className="text-sm text-muted-foreground">
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
            {xpForCurrentLevel}/{xpToLevelUp}
            <span className="text-primary ml-1">XP</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center h-full w-full">
          <CircularProgress
            className="ml-4"
            value={currentProgressPercentage}
            xpGainValue={xpGainProgressPercentage}
            strokeWidth={8}
            circleSize={80}
          />
          <div className="absolute w-full flex flex-col">
            <div
              // onClick={() => handleOpenChange(true)}
              onClick={handleOpenHabitActions}
              className="flex flex-col items-center justify-center text-xs text-muted-foreground"
            >
              {projectedXp > 0 ? (
                <div>
                  <span className="text-base text-green-500 font-bold">
                    +{projectedXp}
                  </span>
                  <span className="text-primary ml-1">XP</span>
                </div>
              ) : (
                <Plus size={36} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
