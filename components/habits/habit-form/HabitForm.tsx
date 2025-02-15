"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPickerField } from "@components/habits/habit-form/IconPickerField";
import { NameField } from "@components/habits/habit-form/NameField";
// import { DescriptionField } from "@components/habits/habit-form/DescriptionField";
import { ActionsField } from "@components/habits/habit-form/ActionsField";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@components/ui/scroll-area";
import { HabitZodType, habitFormSchema } from "@models/habitFormSchema";
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
      // description: type === "Update" ? habit?.description : "",
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
        className="flex flex-col h-full justify-between"
      >
        <div className="space-y-8 mb-8">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
            {type} Habits
          </h1>
          <IconPickerField
            control={form.control}
            projectedXp={projectedXp}
            type={type}
          />
        </div>

        <ScrollArea className="px-4 flex-grow">
          <div className="space-y-8 px-1">
            <NameField control={form.control} type={type} />
            {/* <DescriptionField control={form.control} /> */}
            <ActionsField control={form.control} type={type} />
          </div>
        </ScrollArea>
        <div className="flex flex-col justify-center items-center mt-2 px-4">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full mt-3 mb-4"
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
