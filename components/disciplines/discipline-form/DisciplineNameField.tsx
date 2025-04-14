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

type DisciplineNameFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

export function DisciplineNameField({
  control,
  type,
}: DisciplineNameFieldProps) {
  return (
    <FormField
      control={control}
      name="discipline"
      // name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discipline</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Discipline name
            </FormDescription>
          )}

          <FormControl>
            <Input
              className="text-base"
              placeholder="e.g., Motivation, Confidence, etc."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
