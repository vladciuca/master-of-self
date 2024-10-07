import { useState, useCallback } from "react";
import { HabitProgressBar } from "./HabitProgressBar";
import { HabitAction } from "./HabitAction";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { calculateLevel, xpForLevel } from "@lib/level";
import { Habit } from "@app/types/types";

type HabitActionsProps = {
  habit: Habit;
  projectedHabitXp: number;
  onChange: (habitId: string, actionId: string, newValue: number) => void;
  actionChanges: { [key: string]: { [key: string]: number } };
};

export function HabitActions({
  habit,
  projectedHabitXp,
  onChange,
  actionChanges,
}: HabitActionsProps) {
  const { name, icon, xp, _id: habitId } = habit;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
    actionChanges[habitId] || {}
  );

  // Calculate XP and level
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

  // Add a function to handle action changes
  const handleActionChange = useCallback(
    (actionId: string, newValue: number) => {
      setActionValues((prev) => {
        const updatedValues = { ...prev, [actionId]: newValue };
        onChange(habitId, actionId, newValue);
        return updatedValues;
      });
    },
    [habitId, onChange]
  );

  return (
    <div className="p-2 px-4 flex justify-between text-start w-full">
      <div className="flex flex-grow">
        <div className="flex items-center justify-center">
          <HabitProgressBar
            icon={icon}
            xp={xp}
            currentProgressPercentage={currentProgressPercentage}
            xpGainProgressPercentage={xpGainProgressPercentage}
          />
        </div>
        <div className="px-4 flex flex-col justify-center">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {name}
          </h4>
          <div className="text-sm text-muted-foreground flex items-center">
            Level {level}
            <span className="mx-2 text-primary font-extralight text-xl">|</span>
            {xpForCurrentLevel}/{xpToLevelUp}
          </div>
          <div>
            <span className="text-2xl text-green-500 font-bold">
              +{projectedHabitXp}
            </span>
            <span className="text-primary ml-1">XP</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            {projectedHabitXp > 0 ? (
              <Button size="icon" className="h-8 w-8 shrink-0 rounded-md">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Take Action Button</span>
              </Button>
            ) : (
              <Checkbox
                checked={isDrawerOpen}
                className={`h-8 w-8 rounded-md border-primary ${
                  isDrawerOpen
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                }`}
              />
            )}
          </DrawerTrigger>
          <DrawerContent className="max-w-md mx-auto left-0 right-0">
            <DrawerHeader>
              <div>
                <HabitProgressBar
                  icon={icon}
                  xp={xp}
                  currentProgressPercentage={currentProgressPercentage}
                  xpGainProgressPercentage={xpGainProgressPercentage}
                />
              </div>

              <DrawerTitle className="mt-4">{name} Actions</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="h-[40vh] p-4">
              {habit.actions.map((action) => (
                <HabitAction
                  key={action.id}
                  action={action}
                  value={actionValues[action.id] || 0}
                  onValueChange={handleActionChange}
                />
              ))}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
