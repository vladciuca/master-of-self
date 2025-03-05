"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPickerField } from "@components/habits/habit-form/IconPickerField";
import { CategoryNameField } from "@components/habits/habit-form/CategoryNameField";
import { ActionsField } from "@components/habits/habit-form/action-field/ActionField";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { type HabitZodType, habitFormSchema } from "@models/habitFormSchema";

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
      category: type === "Update" ? habit?.category : "",
      icon: type === "Update" ? habit?.icon : "",
      xp: type === "Update" ? habit?.xp : 0,
      actions: type === "Update" ? habit?.actions || [] : [],
    },
  });

  useEffect(() => {
    if (type === "Update" && habit) {
      form.reset(habit);
    }
  }, [type, habit, form]);

  const handleHabitSubmit = (data: HabitZodType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleHabitSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <div className="space-y-8 mb-8">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
            {type} Habits
          </h1>
        </div>

        <ScrollArea className="px-4 flex-grow">
          <IconPickerField
            control={form.control}
            projectedXp={projectedXp}
            type={type}
          />
          <div className="space-y-8 px-1">
            <CategoryNameField control={form.control} type={type} />
            <ActionsField control={form.control} type={type} />
          </div>
        </ScrollArea>

        <div className="flex flex-col justify-center items-center mt-2 px-4">
          <Button
            className="w-full mt-3 mb-4"
            type="submit"
            disabled={submitting}
          >
            {type}
          </Button>
          <Link href="/habits" className="w-full flex justify-center mb-4">
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
