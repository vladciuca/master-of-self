"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPickerField } from "@components/habits/habit-form/IconPickerField";
import { NameField } from "@components/habits/habit-form/NameField";
import { DescriptionField } from "@components/habits/habit-form/DescriptionField";
import { ActionsField } from "@components/habits/habit-form/ActionsField";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  HabitZodType,
  habitFormSchema,
} from "@components/habits/habit-form/habitFormSchema";
import { Button } from "@/components/ui/button";

type HabitFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: HabitZodType) => Promise<void>;
  habit?: HabitZodType;
  projectedXp?: number;
};

export function HabitForm({
  type,
  submitting,
  onSubmit,
  habit,
  projectedXp,
}: HabitFormProps) {
  const form = useForm<HabitZodType>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      id: type === "Update" ? habit?.id : undefined,
      name: type === "Update" ? habit?.name : "",
      icon: type === "Update" ? habit?.icon : "",
      description: type === "Update" ? habit?.description : "",
      xp: type === "Update" ? habit?.xp : 0,
      actions: type === "Update" ? habit?.actions || [] : [],
    },
  });

  useEffect(() => {
    if (type === "Update" && habit) {
      form.reset(habit);
    }
  }, [type, habit, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 h-full justify-between"
      >
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
          {type} Habit
        </h1>
        <IconPickerField control={form.control} projectedXp={projectedXp} />
        <ScrollArea className="px-4 sm:px-0">
          <NameField control={form.control} />
          <DescriptionField control={form.control} />
          <ActionsField control={form.control} />

          <div className="flex flex-col justify-center items-center flex-grow mt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 mb-4"
            >
              {type} Habit
            </Button>
            <Link href="/habits" className="w-full flex justify-center mb-4">
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </form>
    </Form>
  );
}
