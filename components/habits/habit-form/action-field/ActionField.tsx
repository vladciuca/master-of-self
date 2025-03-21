"use client";
import { useState, useCallback } from "react";
import { type Control, useFieldArray, useWatch } from "react-hook-form";

import type { HabitZodType } from "@models/habitFormSchema";
import type { HabitAction } from "@models/types";

import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import { Plus } from "lucide-react";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

import { ActionFieldItem } from "./ActionFieldItem";
import { ActionForm } from "./ActionForm";

type ActionsFieldProps = {
  control: Control<HabitZodType>;
  type: "Create" | "Update";
};

export function ActionsField({ control, type }: ActionsFieldProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { drawerStyle } = useSideContentPosition();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "actions",
  });

  const actions = useWatch({
    control,
    name: "actions",
    defaultValue: [],
  }) as HabitAction[];

  const handleActionSubmit = (data: Omit<HabitAction, "id" | "value">) => {
    if (editId !== null) {
      const editIndex = actions.findIndex((action) => action.id === editId);
      if (editIndex !== -1) {
        update(editIndex, {
          ...data,
          id: editId,
          value: actions[editIndex].value,
        });
      }
      setEditId(null);
    } else {
      append({ ...data, id: crypto.randomUUID(), value: 0 });
    }
    setIsDrawerOpen(false);
  };

  const handleRemoveAction = useCallback(
    (id: string) => () => {
      const removeIndex = actions.findIndex((action) => action.id === id);
      if (removeIndex !== -1) {
        remove(removeIndex);
      }
    },
    [remove, actions]
  );

  const handleEditAction = useCallback(
    (id: string) => () => {
      const actionToEdit = actions.find((action) => action.id === id);
      if (actionToEdit) {
        setEditId(id);
        setIsDrawerOpen(true);
      }
    },
    [actions, setEditId, setIsDrawerOpen]
  );

  const handleAddAction = useCallback(() => {
    setEditId(null);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const initialData = editId
    ? actions.find((action) => action.id === editId)
    : null;

  return (
    <FormField
      control={control}
      name="actions"
      render={() => (
        <FormItem>
          <FormLabel>Habit Actions</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              {/* Define specific, measurable actions you’ll take each day to build
              or break a habit. These should be concrete and realistic—actions
              you can clearly track as completed or not completed—helping you
              achieve mastery within your chosen category. */}
              Define the specific daily actions that contribute to your habit.
              Each habit can have multiple alternative actions, that can
              ,categorized as either “Build Action" (reinforcing positive
              behaviors) or “Break Action" (reducing unwanted behaviors). To
              maintain consistency, actions come in three difficulty
              levels—Easy, Medium, and Hard—so you can adjust based on your
              capacity while keeping your 30-day habit streak alive.
            </FormDescription>
          )}

          <div className="flex flex-col gap-2">
            {/* HERE WE SHOULD MAP OVER THE ARRAY NOT FIELDS */}
            {fields.map((field, index) => {
              const action = actions[index] as HabitAction;
              if (!action) return null;

              return (
                <div key={field.id} className="border p-2 rounded-md">
                  <ActionFieldItem
                    action={action}
                    handleRemoveAction={handleRemoveAction(action.id)}
                    handleEditAction={handleEditAction(action.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* NOTE TO SELF: NEVER FUCKING PUT INPUTS IN DRAWERS 
          REFACTOR THIS IN HABIT REFACTOR */}
          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            repositionInputs={false}
          >
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleAddAction}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </DrawerTrigger>

            <DrawerContent
              className="max-w-md mx-auto right-0 left-0"
              style={drawerStyle}
            >
              <ActionForm
                handleActionSubmit={handleActionSubmit}
                initialData={initialData}
                handleCloseDrawer={handleCloseDrawer}
              />
            </DrawerContent>
          </Drawer>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
