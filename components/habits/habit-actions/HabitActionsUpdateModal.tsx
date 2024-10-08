"use client";

import { useEffect, useState, useCallback } from "react";
import { HabitIconProgressBar } from "@components/habits/habit-actions/HabitIconProgressBar";
import { HabitAction } from "@components/habits/habit-actions/HabitAction";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@components/ui/scroll-area";
import { useTodayJournalEntry } from "@hooks/useTodayJournalEntry";
import { Habit } from "@app/types/types";

type HabitActionsUpdateModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
  actionChanges?: { [key: string]: { [key: string]: number } }; //FORM FORM STEP!?
};

export function HabitActionsUpdateModal({
  isOpen,
  onOpenChange,
  habit,
  actionChanges, //FORM FORM STEP!? to pass down to habit action,
}: //this should be removed and handled in the submit of the component
HabitActionsUpdateModalProps) {
  const { name, icon, xp, _id: habitId } = habit;
  // Initialize actionValues state
  const [actionValues, setActionValues] = useState<{ [key: string]: number }>(
    {}
  );
  const { todayEntry, todayEntryLoading } = useTodayJournalEntry();

  // Calculate projected XP gain
  const projectedHabitXp = Object.values(actionValues).reduce(
    (sum, value) => sum + value,
    0
  );

  // Update actionValues when todayEntry changes
  useEffect(() => {
    if (!todayEntryLoading && todayEntry?.nightEntry?.actions) {
      // Initialize actionValues with values from todayEntry
      const initialValues = todayEntry.nightEntry.actions[habitId] || {};
      setActionValues(initialValues);
    }
  }, [todayEntry, todayEntryLoading, habitId]);

  // Handle action value changes
  const handleActionChange = useCallback(
    (actionId: string, newValue: number) => {
      setActionValues((prev) => ({
        ...prev,
        [actionId]: newValue,
      }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = () => {
    // Here you would typically update your backend or global state
    console.log("Submitting action values:", actionValues);
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
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
          <DrawerTitle className="w-full text-center">
            {name} Actions
          </DrawerTitle>
          <DrawerDescription className="w-full text-center">
            Update your progress or add notes for this habit.
          </DrawerDescription>
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
            <Button variant="default" onClick={handleSubmit}>
              Done
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
