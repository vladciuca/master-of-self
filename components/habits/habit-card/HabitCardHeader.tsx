import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
import { calculateLevel, xpForLevel } from "@lib/level";
import { Habit } from "@app/types/types";

type HabitCardHeaderProps = {
  habit: Habit;
};

export function HabitCardHeader({ habit }: HabitCardHeaderProps) {
  const { name, icon, xp } = habit;
  const level = calculateLevel(xp);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const progressPercentage = ((xp - baseXP) / (nextLevelXP - baseXP)) * 100;
  const xpForCurrentLevel = xp - baseXP;
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
          <div className="text-sm text-muted-foreground">Level {level}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center h-full w-full">
          <CircularProgress
            className="ml-4"
            value={progressPercentage}
            strokeWidth={6}
            circleSize={70}
          />
          <div
            className="absolute w-full flex flex-col"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="flex flex-col items-center justify-center text-xs text-muted-foreground"
              style={{ pointerEvents: "none" }}
            >
              <div>{xpForCurrentLevel}</div>
              <hr className="border-primary my-1 w-6" />
              <div>{xpToLevelUp}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
