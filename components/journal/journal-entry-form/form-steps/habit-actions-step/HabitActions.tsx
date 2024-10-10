import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HabitIconProgressBar } from "@components/habits/habit-actions/HabitIconProgressBar";
import { HabitAction } from "../../../../habits/habit-actions/HabitAction";
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
import { formatNumberSuffixes } from "@lib/utils";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { name, icon, xp, _id: habitId } = habit;
  const habitIdParam = searchParams.get("habitId");
  // const isHabitDrawerOpen = habitIdParam === habitId;
  // console.log("===============", habitIdParam);
  const [isDrawerOpen, setIsDrawerOpen] = useState(habitIdParam === habitId);

  const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
    actionChanges[habitId] || {}
  );

  // Calculate XP and level
  const xpGain = xp + projectedHabitXp;
  const level = calculateLevel(xpGain);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  // Update URL when drawer opens/closes
  // useEffect(() => {
  //   if (isDrawerOpen) {
  //     router.push(`?habitId=${habitId}`, { scroll: false });
  //   } else {
  //     return;
  //   }
  // }, [isDrawerOpen, habitId, router]);

  // Function to update URL
  // const updateURL = useCallback(
  //   (open: boolean) => {
  //     if (!habitIdParam) return;
  //     const currentParams = new URLSearchParams(searchParams.toString());
  //     if (open) {
  //       currentParams.delete("habitId");
  //     }
  //     const newURL = currentParams.toString()
  //       ? `?${currentParams.toString()}`
  //       : "/";

  //     router.push(newURL, { scroll: false });
  //   },
  //   [habitIdParam, router, searchParams]
  // );
  const updateURL = useCallback(
    (open: boolean) => {
      // CHANGE: Only remove the habitId parameter when closing the drawer
      if (!open) {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete("habitId");
        const newURL = currentParams.toString()
          ? `?${currentParams.toString()}`
          : "/";
        router.push(newURL, { scroll: false });
      }
      // NOTE: We don't add a new habitId when opening a drawer
    },
    [router, searchParams]
  );

  // Update URL when drawer opens/closes
  // useEffect(() => {
  //   updateURL(isDrawerOpen);
  // }, [isDrawerOpen, updateURL]);
  useEffect(() => {
    // CHANGE: Only call updateURL when the drawer is closing
    if (!isDrawerOpen) {
      updateURL(false);
    }
  }, [isDrawerOpen, updateURL]);

  // Handle drawer open/close
  // const handleDrawerOpenChange = (open: boolean) => {
  //   setIsDrawerOpen(open);
  // };

  // Sync local state with URL parameter
  useEffect(() => {
    // CHANGE: Set drawer open if habitIdParam matches this habit's id
    if (habitIdParam === habitId) {
      setIsDrawerOpen(true);
    }
  }, [habitIdParam, habitId]);

  // Handle drawer open/close
  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    // CHANGE: Only update URL when closing the drawer
    if (!open) {
      updateURL(false);
    }
  };

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
          <HabitIconProgressBar
            icon={icon}
            xp={xp}
            projectedXp={projectedHabitXp}
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
            <span className="mx-2 text-primary font-extralight text-xl">|</span>
            {formatNumberSuffixes(xpForCurrentLevel)}/
            {formatNumberSuffixes(xpToLevelUp)}
            <span className="text-primary ml-1">XP</span>
          </div>
          {projectedHabitXp > 0 ? (
            <div>
              <span className="text-2xl text-green-500 font-bold">
                +{projectedHabitXp}
              </span>
              <span className="text-primary ml-1">XP</span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
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
              <div className="flex justify-center mb-4">
                <HabitIconProgressBar
                  icon={icon}
                  xp={xp}
                  projectedXp={projectedHabitXp}
                  displayXpValues
                />
              </div>
              <DrawerTitle className="text-center">{name} Actions</DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="h-[50vh] p-4">
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
                <Button variant="default">Done</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
