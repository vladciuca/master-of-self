"use client";
import { useState, useCallback } from "react";
import { type Control, useFieldArray, useWatch } from "react-hook-form";
import { HabitCardActionText } from "@components/habits/habit-card/HabitCardActionText";

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

import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { Plus, FilePenLine } from "lucide-react";
import { useSideContentPosition } from "@hooks/useSideContentPosition";

import { ActionForm } from "./ActionForm";
import { DeleteActionButton } from "./DeleteActionButton";

import { HABIT_COLORS } from "@lib/colors";

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

  const removeAction = (id: string) => {
    const removeIndex = actions.findIndex((action) => action.id === id);
    if (removeIndex !== -1) {
      remove(removeIndex);
    }
  };

  const editAction = (id: string) => {
    const actionToEdit = actions.find((action) => action.id === id);
    if (actionToEdit) {
      setEditId(id);
      setIsDrawerOpen(true);
    }
  };

  const initialData = editId
    ? actions.find((action) => action.id === editId)
    : undefined;
  const onClose = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <FormField
      control={control}
      name="actions"
      render={() => (
        <FormItem>
          <FormLabel>Habit Actions</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Define specific, measurable actions you’ll take each day to build
              or break a habit. These should be concrete and realistic—actions
              you can clearly track as completed or not completed—helping you
              achieve mastery within your chosen category.
            </FormDescription>
          )}

          <div className="flex flex-col gap-2">
            {fields.map((field, index) => {
              const action = actions[index] as HabitAction;
              if (!action) return null;

              return (
                <div key={field.id} className="border p-2 rounded-md">
                  <div className="flex items-center max-w-full border-b pb-1 mb-2">
                    <HabitCardActionText
                      actionTask={action.task}
                      actionIcon={<ActionIcon type={action.type} size={18} />}
                      actionType={action.type}
                    />

                    <div>
                      <DeleteActionButton
                        onDelete={() => removeAction(action.id)}
                        actionName={action.task}
                        actionPrefix={
                          action.type === "build" ? "I will" : "I won't"
                        }
                        actionIcon={<ActionIcon type={action.type} size={18} />}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-1">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">
                        Daily {action.type === "build" ? "Target" : "Limit"}:
                      </span>
                      <span className="mx-1">
                        <MetricIcon metric={action.metric} size={18} />
                      </span>
                      {action.dailyTarget} {action.unit}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => editAction(action.id)}
                      aria-label={`Edit action ${action.task}`}
                      className={`h-8 w-8 p-0 text-${HABIT_COLORS.main} hover:text-${HABIT_COLORS.main}`}
                    >
                      <FilePenLine size={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            repositionInputs={true}
          >
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setEditId(null);
                  setIsDrawerOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </DrawerTrigger>

            <DrawerContent
              className="max-w-md mx-auto right-0 left-0"
              style={drawerStyle}
            >
              <ActionForm
                onSubmit={handleActionSubmit}
                initialData={initialData}
                onClose={onClose}
              />
            </DrawerContent>
          </Drawer>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
