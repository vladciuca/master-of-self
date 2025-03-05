"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitFormSchema } from "@models/habitFormSchema";
import type { HabitAction } from "@models/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Slider } from "@components/ui/slider";
import { ScrollArea } from "@components/ui/scroll-area";

import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { ArrowBigRightDash } from "lucide-react";

// Import the action schema from habitFormSchema
const actionSchema = habitFormSchema.shape.actions.element;

type ActionFormProps = {
  handleActionSubmit: (data: Omit<HabitAction, "id" | "value">) => void;
  initialData?: HabitAction | null;
  handleCloseDrawer: () => void;
};

const initialActionState = {
  task: "",
  unit: "",
  metric: "count" as const,
  type: "build" as const,
  dailyTarget: 1,
};

export function ActionForm({
  handleActionSubmit,
  initialData,
  handleCloseDrawer,
}: ActionFormProps) {
  // Use react-hook-form but without a nested form element
  const form = useForm<Omit<HabitAction, "id" | "value">>({
    resolver: zodResolver(actionSchema),
    defaultValues: initialData || initialActionState,
  });

  const handleAddAction = useCallback(() => {
    // Validate all fields using react-hook-form
    form.handleSubmit((data) => {
      handleActionSubmit(data);

      // Reset form if not editing
      if (!initialData) {
        form.reset(initialActionState);
      }

      // Close drawer
      handleCloseDrawer();
    })();
  }, [form, handleActionSubmit, initialData, handleCloseDrawer]);

  return (
    // Use Form component but without the form element
    <Form {...form}>
      <div className="pb-4">
        <ScrollArea className="h-[80vh] px-4 pt-4">
          <DrawerHeader>
            <DrawerTitle className="text-center flex flex-col">
              {initialData ? "Edit Action" : "Add New Action"}
              <div className="w-full">
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <ActionIcon
                    type={form.watch("type")}
                    dailyTargetCompleted={false}
                    overCapped={false}
                    size={30}
                  />
                  <ArrowBigRightDash />
                  <ActionIcon
                    type={form.watch("type")}
                    dailyTargetCompleted={true}
                    overCapped={false}
                    size={30}
                  />
                </div>
              </div>
            </DrawerTitle>
            <DrawerDescription className="text-center mt-2">
              {initialData
                ? "Edit your habit action details below"
                : "Add a new habit action by filling out the details below"}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-1 pb-4 space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to...</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="build">
                        <span className="flex items-center">
                          <ActionIcon type="build" size={20} />
                          <span className="ml-2">Build a habit</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="break">
                        <span className="flex items-center">
                          <ActionIcon type="break" size={20} />
                          <span className="ml-2">Break a habit</span>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("type") === "build"
                      ? "I will..."
                      : "I won't..."}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="e.g., Do pushups, Read books, Meditate"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the specific action you'll take. Make it clear and
                    measurable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Form field for METRIC(currently hidden and set as default value - first option) */}
            {/* <FormField
              control={form.control}
              name="metric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action tracking metric</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="count">
                        <span className="flex items-center">
                          <span className="mr-2">
                            <MetricIcon metric="count" size={18} />
                          </span>
                          Count
                        </span>
                      </SelectItem>
                      <SelectItem value="time">
                        <span className="flex items-center">
                          <span className="mr-2">
                            <MetricIcon metric="time" size={18} />
                          </span>
                          Time
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Unit</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="e.g., repetitions, pages, minutes"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose the unit that best measures your action (what you'll
                    count or track each day)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center mb-6">
                    Daily {form.watch("type") === "build" ? "Target" : "Limit"}:
                    <span className="ml-2 space-x-1 text-lg flex items-center">
                      <MetricIcon metric={form.watch("metric")} size={20} />
                      <span>{field.value}</span>
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-center items-center my-2 pt-4">
            <Button
              className="w-full mt-3 mb-4"
              type="button"
              onClick={handleAddAction}
            >
              {initialData ? "Update Action" : "Add Action"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCloseDrawer}
            >
              Cancel
            </Button>
          </div>
        </ScrollArea>
      </div>
    </Form>
  );
}
