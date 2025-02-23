"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitFormSchema } from "@models/habitFormSchema";
import type { HabitAction } from "@models/types";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
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

type ActionFormProps = {
  onSubmit: (data: Omit<HabitAction, "id" | "value">) => void;
  initialData?: HabitAction;
  onClose: () => void;
};

const initialActionForm = {
  action: "",
  actionUnit: "",
  metric: "count" as const,
  type: "offensive" as const,
  dailyTarget: 1,
};

export function ActionForm({
  onSubmit,
  initialData,
  onClose,
}: ActionFormProps) {
  const form = useForm<Omit<HabitAction, "id" | "value">>({
    resolver: zodResolver(habitFormSchema.shape.actions.element),
    defaultValues: initialData || initialActionForm,
  });

  const handleSubmit = useCallback(
    (data: Omit<HabitAction, "id" | "value">) => {
      onSubmit(data);
      form.reset();
    },
    [onSubmit, form]
  );

  const handleFormSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit(handleSubmit)();
    },
    [form, handleSubmit]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
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

        <ScrollArea className="h-[45vh] p-4">
          <div className="px-1 space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to...</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="offensive">
                        <span className="flex items-center">
                          <ActionIcon type="offensive" size={20} />
                          Build a habit
                        </span>
                      </SelectItem>
                      <SelectItem value="defensive">
                        <span className="flex items-center">
                          <ActionIcon type="defensive" size={20} />
                          Break a habit
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
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("type") === "offensive"
                      ? "I will..."
                      : "I won't..."}
                  </FormLabel>
                  <FormControl>
                    <Input
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
              name="actionUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Unit</FormLabel>
                  <FormControl>
                    <Input
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
                    Daily{" "}
                    {form.watch("type") === "offensive" ? "Target" : "Limit"}:
                    <span className="ml-2 space-x-1 text-lg flex items-center">
                      <MetricIcon metric={form.watch("metric")} size={20} />
                      <span></span>
                      {field.value}
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
        </ScrollArea>

        <div className="flex flex-col justify-center items-center my-2 px-4">
          <Button
            className="w-full mt-3 mb-4"
            type="submit"
            onClick={handleFormSubmit}
          >
            {initialData ? "Update Action" : "Add Action"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
