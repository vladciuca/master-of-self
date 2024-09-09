"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import IconPicker from "@components/IconPicker";

const formSchema = z.object({
  name: z.string().min(3),
  icon: z.string(),
  description: z.string(),
});

export type Habit = z.infer<typeof formSchema>;

type HabitFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: Habit) => Promise<void>;
  habit?: Habit;
};

const HabitForm = ({ type, submitting, onSubmit, habit }: HabitFormProps) => {
  const form = useForm<Habit>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "Update" ? habit?.name : "",
      icon: type === "Update" ? habit?.icon : "",
      description: type === "Update" ? habit?.description : "",
    },
  });

  const handleIconSelect = (iconId: string) => {
    form.setValue("icon", iconId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-8"
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {type} Habit
        </h1>
        <div>
          <div className="mb-1">
            <FormLabel>Habit icon</FormLabel>
          </div>
          <IconPicker onIconSelect={handleIconSelect} icon={habit?.icon} />
        </div>

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
                    placeholder="Action you need to take daily"
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

        <div className="flex flex-col justify-center items-center">
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
};

export default HabitForm;
