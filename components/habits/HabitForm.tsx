"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IconPicker } from "@components/IconPicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { useIconRarityLevel } from "@/hooks/useIconRarityLevel";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Habit name must contain at least 3 characters")
    .max(25, "Habit name must contain maximum 25 characters"),
  icon: z.string().min(1, "Please select an icon"),
  description: z.string().min(3, "Please add a habit description"),
  xp: z.number().optional(),
});

export type HabitZodType = z.infer<typeof formSchema>;

type HabitFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: HabitZodType) => Promise<void>;
  habit?: HabitZodType;
};

export function HabitForm({
  type,
  submitting,
  onSubmit,
  habit,
}: HabitFormProps) {
  const form = useForm<HabitZodType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "Update" ? habit?.name : "",
      icon: type === "Update" ? habit?.icon : "",
      description: type === "Update" ? habit?.description : "",
      xp: type === "Update" ? habit?.xp : 0,
    },
  });

  const { iconColorClass, bgColorClass } = useIconRarityLevel(form.watch("xp"));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8 h-full justify-between"
      >
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6">
          {type} Habit
        </h1>

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Icon</FormLabel>
              <FormControl>
                <IconPicker
                  value={field.value}
                  onChange={(iconName) => field.onChange(iconName)}
                  iconColorClass={iconColorClass}
                  bgColorClass={bgColorClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Habit name</FormLabel>
                <FormControl>
                  <Input
                    className="text-base"
                    placeholder="A consistent action you can take to improve..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Habit description</FormLabel>
                <FormControl>
                  <Textarea
                    className="text-base"
                    placeholder="How can this action help you achieve your goals?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex flex-col justify-center items-center flex-grow">
          <Button type="submit" disabled={submitting} className="w-1/2 mt-3">
            {type} Habit
          </Button>
          <Link href="/habits" className="w-full flex justify-center my-6">
            <Button variant="secondary" className="w-1/2">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
