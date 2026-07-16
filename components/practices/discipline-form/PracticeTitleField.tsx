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
import { PracticeZodType } from "@models/practiceFormSchema";

type DisciplineTitleFieldProps = {
  control: Control<PracticeZodType>;
  type: "Create" | "Edit";
};

export function PracticeTitleField({
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
          <FormLabel>Practice Prompt</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Write the question you'll answer each day.
            </FormDescription>
          )}

          <FormControl>
            <Input
              className="text-base"
              placeholder="e.g. What am I grateful for today?"
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
