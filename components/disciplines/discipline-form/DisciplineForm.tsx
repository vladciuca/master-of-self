"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { DisciplineIconPickerField } from "@components/disciplines/discipline-form/DisciplineIconPickerField";
import { DisciplineNameField } from "@components/disciplines/discipline-form/DisciplineNameField";
import { DisciplineTypeField } from "@components/disciplines/discipline-form/DisciplineTypeField";
import { DisciplineTitleField } from "@components/disciplines/discipline-form/DisciplineTitleField";
import { DisciplineDescriptionField } from "@components/disciplines/discipline-form/DisciplineDescriptionField";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  type DisciplineZodType,
  disciplineFormSchema,
} from "@models/disciplineFormSchema";

type DisciplineFormProps = {
  type: "Update" | "Create";
  submitting: boolean;
  onSubmit: (habit: DisciplineZodType) => Promise<void>;
  discipline?: DisciplineZodType;
};

export function DisciplineForm({
  type,
  submitting,
  onSubmit,
  discipline,
}: DisciplineFormProps) {
  const form = useForm<DisciplineZodType>({
    resolver: zodResolver(disciplineFormSchema),
    defaultValues: {
      id: type === "Update" ? discipline?.id : undefined,
      discipline: type === "Update" ? discipline?.discipline : "",
      icon: type === "Update" ? discipline?.icon : "",
      type: type === "Update" ? discipline?.type : "dayEntry",
      title: type === "Update" ? discipline?.title : "",
      description: type === "Update" ? discipline?.description : "",
    },
  });

  useEffect(() => {
    if (type === "Update" && discipline) {
      form.reset(discipline);
    }
  }, [type, discipline, form]);

  const handleHabitSubmit = (data: DisciplineZodType) => {
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
            {type} Discipline
          </h1>
          <DisciplineIconPickerField
            control={form.control}
            // xp={xp}
            // projectedXp={projectedXp}
            type={type}
          />
        </div>

        <ScrollArea className="px-4 flex-grow">
          <div className="space-y-8 px-1">
            <DisciplineNameField control={form.control} type={type} />
            <DisciplineTypeField control={form.control} type={type} />
            <DisciplineTitleField control={form.control} type={type} />
            <DisciplineDescriptionField control={form.control} type={type} />
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
            //NOTE: create constants for these
            href="/profile?page=disciplines"
            className="w-full flex justify-center mb-4"
          >
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
