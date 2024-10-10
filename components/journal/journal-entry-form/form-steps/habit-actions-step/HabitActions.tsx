import { useState, useEffect, useCallback, useRef } from "react";
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
  habitsLoading: boolean;
  projectedHabitXp: number;
  onChange: (habitId: string, actionId: string, newValue: number) => void;
  actionChanges: { [key: string]: { [key: string]: number } };
};

export function HabitActions({
  habit,
  habitsLoading,
  projectedHabitXp,
  onChange,
  actionChanges,
}: HabitActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { name, icon, xp, _id: habitId } = habit;
  const habitIdParam = searchParams.get("habitId");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
    actionChanges[habitId] || {}
  );
  const habitContainerRef = useRef<HTMLDivElement>(null);

  // Calculate XP and level
  const xpGain = xp + projectedHabitXp;
  const level = calculateLevel(xpGain);
  const { baseXP, nextLevelXP } = xpForLevel(level);
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;

  const updateURL = useCallback(
    (open: boolean) => {
      if (!open) {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete("habitId");
        const newURL = currentParams.toString()
          ? `?${currentParams.toString()}`
          : "/";
        router.push(newURL, { scroll: false });
      }
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (habitIdParam === habitId && !habitsLoading) {
      handleDrawerOpenChange(true);
    }
  }, [habitIdParam, habitId, habitsLoading]);

  const scrollToHabit = () => {
    if (habitContainerRef.current) {
      habitContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    setIsScrolled(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    if (habitsLoading) return;

    if (open) {
      scrollToHabit();
      const delay = habitIdParam ? 400 : 0;
      setTimeout(() => setIsDrawerOpen(true), delay);
    } else {
      setIsDrawerOpen(false);
      setIsScrolled(false);
      updateURL(false);
    }
  };

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
    <div
      ref={habitContainerRef}
      className="p-2 px-4 flex justify-between text-start w-full"
    >
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
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-md"
                onClick={() => !isScrolled && scrollToHabit()}
              >
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
                onClick={() => !isScrolled && scrollToHabit()}
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
