import { useState } from "react";
import { HabitIconProgressBar } from "@components/habits/habit-actions/HabitIconProgressBar";
import { HabitActionsUpdateModal } from "@components/habits/habit-actions/HabitActionsUpdateModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { calculateLevel, xpForLevel } from "@lib/level";
import { formatNumberSuffixes } from "@lib/utils";
import { Habit } from "@app/types/types";

type HabitActionHeaderProps = {
  habit: Habit;
  projectedXp: number;
  onChange: (habitId: string, actionId: string, newValue: number) => void;
  actionChanges: { [key: string]: { [key: string]: number } };
};

export function HabitActionHeader({
  habit,
  projectedXp,
}: HabitActionHeaderProps) {
  const { name, icon, xp, _id: habitId } = habit;
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);

  // Calculate XP and level
  const xpGain = xp + projectedXp;
  const level = calculateLevel(xpGain);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  const handleOpenChange = (open: boolean) => {
    setIsActionDrawerOpen(open);
  };

  return (
    <>
      <div
        key={habitId}
        className="mb-8 p-2 px-4 flex justify-between text-start w-full"
      >
        <div className="flex flex-grow">
          <div className="flex items-center justify-center">
            <HabitIconProgressBar
              icon={icon}
              xp={xp}
              projectedXp={projectedXp}
            />
          </div>
          <div className="px-4 flex flex-col justify-center">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {name}
            </h4>
            <div className="text-sm text-muted-foreground flex items-center">
              <span className="font-semibold">
                Level<span className="text-primary ml-1">{level}</span>
              </span>
              <span className="mx-2 text-primary font-extralight text-xl">
                |
              </span>
              {formatNumberSuffixes(xpForCurrentLevel)}/
              {formatNumberSuffixes(xpToLevelUp)}
              <span className="text-primary ml-1">XP</span>
            </div>
            {projectedXp > 0 ? (
              <div>
                <span className="text-2xl text-green-500 font-bold">
                  +{formatNumberSuffixes(projectedXp)}
                </span>
                <span className="text-primary ml-1">XP</span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          className="flex items-center"
          onClick={() => handleOpenChange(!isActionDrawerOpen)}
        >
          {projectedXp > 0 ? (
            <Button size="icon" className="h-8 w-8 shrink-0 rounded-md">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Take Action Button</span>
            </Button>
          ) : (
            <Checkbox
              checked={isActionDrawerOpen}
              className={`h-8 w-8 rounded-md border-primary ${
                isActionDrawerOpen
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            />
          )}
        </div>
      </div>
      <HabitActionsUpdateModal
        isOpen={isActionDrawerOpen}
        onOpenChange={handleOpenChange}
        habit={habit}
      />
    </>
  );
}
