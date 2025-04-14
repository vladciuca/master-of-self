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
          <FormLabel>Question</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Discipline Question
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
