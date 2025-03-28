import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HabitIconProgressBar } from "@components/habits/HabitIconProgressBar";
import { LevelIndicator } from "@components/ui/level-indicator";
import { HabitAction } from "@components/habits/habit-actions/HabitAction";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { XpDisplay } from "@components/ui/xp-display";
import { Plus } from "lucide-react";
import { calculateHabitLevel, xpForHabitLevel } from "@lib/level";
import { formatNumberSuffixes } from "@lib/utils";
import type { Habit, JournalEntryHabitActions } from "@models/types";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

type HabitActionsProps = {
  habit: Habit;
  habitsLoading: boolean;
  projectedHabitXp: number;
  onChange: (habitId: string, actionId: string, newValue: number) => void;
  actionChanges: JournalEntryHabitActions & { currentXp?: number };
  totalWillpower: number;
};

export function HabitActions({
  habit,
  habitsLoading,
  projectedHabitXp,
  onChange,
  actionChanges,
  totalWillpower,
}: HabitActionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { drawerStyle } = useSideContentPosition();
  const { name, icon, xp, _id: habitId } = habit;
  const habitIdParam = searchParams.get("habitId");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [actionValues, setActionValues] = useState<JournalEntryHabitActions>(
    actionChanges || {}
  );
  const habitContainerRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);

  // NOTE: These are used to display the XP stats
  // Calculate XP and level_PATTERN
  // ===============================================================
  const xpGain = xp + projectedHabitXp;
  const level = calculateHabitLevel(xpGain);
  const currentLevel = calculateHabitLevel(xp);
  const { baseXP, nextLevelXP } = xpForHabitLevel(level);
  const xpForCurrentLevel = xpGain - baseXP;
  const xpToLevelUp = nextLevelXP - baseXP;
  // ===============================================================

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
    if (habitsLoading) return;

    let timeoutId: NodeJS.Timeout;

    if (
      habitIdParam === habitId &&
      !habitsLoading &&
      !hasInteractedRef.current
    ) {
      hasInteractedRef.current = true;

      // First, scroll to the habit
      if (habitContainerRef.current) {
        habitContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      // Then, after a delay to allow scrolling animation to be visible, open the drawer
      const delay = 400;
      timeoutId = setTimeout(() => {
        setIsDrawerOpen(true);
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [habitIdParam, habitId, habitsLoading]);

  useEffect(() => {
    if (!isDrawerOpen) {
      hasInteractedRef.current = false;
    }
  }, [isDrawerOpen]);

  const handleDrawerOpenChange = (open: boolean) => {
    if (habitsLoading) return;

    if (open) {
      // If we're opening manually (not from URL param effect)
      if (!hasInteractedRef.current) {
        if (habitContainerRef.current) {
          habitContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
        hasInteractedRef.current = true;
      }
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
      hasInteractedRef.current = false;
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
            <span className="font-semibold flex items-center">
              Level
              <span className="text-primary ml-1 flex items-center">
                {level}
                <LevelIndicator currentLevel={currentLevel} level={level} />
              </span>
            </span>
            <span className="mx-1 text-muted text-lg">|</span>
            {formatNumberSuffixes(xpForCurrentLevel)}/
            {formatNumberSuffixes(xpToLevelUp)}
            <span className="text-primary ml-1">XP</span>
          </div>
          {projectedHabitXp !== 0 ? (
            <div>
              <span className="text-2xl font-bold">
                <XpDisplay xpValue={projectedHabitXp} />
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
            {projectedHabitXp !== 0 ? (
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
          <DrawerContent
            className="max-w-md mx-auto right-0"
            style={drawerStyle}
          >
            <DrawerHeader>
              <DrawerTitle className="sr-only">{`${name} Actions`}</DrawerTitle>
              <DrawerDescription className="sr-only">
                Manage actions for the habit: {name}
              </DrawerDescription>
              <div className="flex justify-center">
                <HabitIconProgressBar
                  icon={icon}
                  xp={xp}
                  projectedXp={projectedHabitXp}
                  displayXpValues
                  displayLevelValues
                />
              </div>
            </DrawerHeader>
            <ScrollArea className="h-[50vh] p-4">
              {habit.actions.map((action) => {
                return (
                  <HabitAction
                    key={action.id}
                    action={action}
                    isActionBreak={action.type === "break"}
                    value={actionValues[action.id] || 0}
                    onValueChange={handleActionChange}
                    totalWillpower={totalWillpower}
                    currentXp={xp}
                    projectedHabitXp={projectedHabitXp}
                  />
                );
              })}
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
