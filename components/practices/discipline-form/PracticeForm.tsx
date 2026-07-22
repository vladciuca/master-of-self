"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { IconRenderer } from "@components/IconRenderer";
import { isHexColor } from "@lib/utils";
import { FaPersonCircleQuestion } from "react-icons/fa6";
import {
  type PracticeZodType,
  practiceFormSchema,
} from "@models/practiceFormSchema";

type PracticeFormProps = {
  type: "Edit" | "Create";
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
      id: type === "Edit" ? practice?.id : undefined,
      discipline: type === "Edit" ? practice?.discipline : "",
      icon: type === "Edit" ? practice?.icon : "",
      color: type === "Edit" ? practice?.color : "",
      type: type === "Edit" ? practice?.type : "dayEntry",
      title: type === "Edit" ? practice?.title : "",
      description: type === "Edit" ? practice?.description : "",
    },
  });

  useEffect(() => {
    if (type === "Edit" && practice) {
      form.reset(practice);
    }
  }, [type, practice, form]);

  const handleHabitSubmit = (data: PracticeZodType) => {
    onSubmit(data);
  };

  const selectedIcon = useWatch({ control: form.control, name: "icon" });
  const selectedColor = useWatch({ control: form.control, name: "color" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleHabitSubmit)}
        className="flex flex-col h-full justify-between"
      >
        <div className="space-y-4 mb-4">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
            {type} Practice
          </h1>
          <div className="flex justify-center">
            {selectedIcon ? (
              <IconRenderer
                iconName={selectedIcon}
                className={`border border-primary p-2 rounded-md ${
                  isHexColor(selectedColor)
                    ? ""
                    : selectedColor
                      ? `text-${selectedColor}`
                      : ""
                }`}
                style={
                  isHexColor(selectedColor)
                    ? { color: selectedColor }
                    : undefined
                }
                size={50}
              />
            ) : (
              <div className="border border-primary p-2 rounded-md w-[66px] h-[66px] flex items-center justify-center">
                <FaPersonCircleQuestion className="h-[50px] w-[50px]" />
              </div>
            )}
          </div>
          {/*{type === "Create" && (
            <p className="text-center text-muted-foreground text-sm px-6 sm:px-8">
              Create a practice by choosing a Discipline and defining a daily
              Practice.
            </p>
          )}*/}
        </div>

        <ScrollArea className="px-4 flex-grow">
          <div className="space-y-8 px-1 mt-4">
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
            className="w-full mt-3 mb-4 rounded-full"
            type="submit"
            disabled={submitting}
          >
            {type}
          </Button>
          <Link
            href="/settings?page=Practices"
            className="w-full flex justify-center mb-4"
          >
            <Button variant="secondary" className="w-full rounded-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
