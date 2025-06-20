import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Control } from "react-hook-form";
import { DisciplineZodType } from "@models/disciplineFormSchema";

type DisciplineTitleFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

export function DisciplineTitleField({
  control,
  type,
}: DisciplineTitleFieldProps) {
  return (
    <FormField
      control={control}
      name="title"
      // name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Daily Reflection Prompt</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Write a question that will guide your daily self-reflection and
              help you develop this discipline.
            </FormDescription>
          )}

          <FormControl>
            <Input
              className="text-base"
              placeholder="e.g., What will make today great?, etc."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
