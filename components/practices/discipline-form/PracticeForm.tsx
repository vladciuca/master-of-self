"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PracticeIconPickerField } from "@components/practices/discipline-form/PracticeIconPickerField";
import { PracticeDisciplineField } from "@components/practices/discipline-form/PracticeDisciplineField";
import { PracticeTypeField } from "@components/practices/discipline-form/PracticeTypeField";
import { PracticeTitleField } from "@components/practices/discipline-form/PracticeTitleField";
import { PracticeDescriptionField } from "@components/practices/discipline-form/PracticeDescriptionField";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  type PracticeZodType,
  practiceFormSchema,
} from "@models/practiceFormSchema";

type PracticeFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: PracticeZodType) => Promise<void>;
  practice?: PracticeZodType;
};

export function PracticeForm({
  type,
  submitting,
  onSubmit,
  practice,
}: PracticeFormProps) {
  const form = useForm<PracticeZodType>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      id: type === "Update" ? practice?.id : undefined,
      discipline: type === "Update" ? practice?.discipline : "",
      icon: type === "Update" ? practice?.icon : "",
      color: type === "Update" ? practice?.color : "",
      type: type === "Update" ? practice?.type : "dayEntry",
      title: type === "Update" ? practice?.title : "",
      description: type === "Update" ? practice?.description : "",
    },
  });

  useEffect(() => {
    if (type === "Update" && practice) {
      form.reset(practice);
    }
  }, [type, practice, form]);

  const handleHabitSubmit = (data: PracticeZodType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleHabitSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <div className="space-y-6 mb-4">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
            {type} Practice
          </h1>
          {type === "Create" && (
            <p className="text-center text-muted-foreground text-sm">
              Create a practice by choosing a Discipline and defining a daily
              Practice.
            </p>
          )}
        </div>

        <ScrollArea className="px-4 flex-grow">
          <div className="space-y-8 px-1">
            <PracticeTitleField control={form.control} type={type} />
            <PracticeDescriptionField control={form.control} type={type} />
            <PracticeTypeField control={form.control} type={type} />
            <PracticeDisciplineField control={form.control} type={type} />
            <PracticeIconPickerField
              control={form.control}
              // xp={xp}
              // projectedXp={projectedXp}
              type={type}
            />
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
          <Link
            href="/settings?page=Practices"
            className="w-full flex justify-center mb-4"
          >
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
