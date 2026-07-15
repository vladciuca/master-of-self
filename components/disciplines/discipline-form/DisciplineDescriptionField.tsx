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
          <FormLabel>Practice Guide</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Add a short reminder to help you complete this practice
              intentionally.
            </FormDescription>
          )}

          <FormControl>
            <Textarea
              rows={3}
              className="text-base"
              placeholder="e.g. Focus on meaningful moments instead of repeating yesterday's answers."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
