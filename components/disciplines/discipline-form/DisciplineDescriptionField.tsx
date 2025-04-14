import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { Control } from "react-hook-form";
import { DisciplineZodType } from "@models/disciplineFormSchema";

type DisciplineDescriptionFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

export function DisciplineDescriptionField({
  control,
  type,
}: DisciplineDescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      // name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Discipline Description
            </FormDescription>
          )}

          <FormControl>
            <Textarea
              rows={3}
              className="text-base"
              placeholder="e.g., Think of what will make today great!, etc."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
