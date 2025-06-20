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
          <FormLabel>Discipline Guidelines</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Provide a brief guideline or mindset to help you approach this
              discipline thoughtfully.
            </FormDescription>
          )}

          <FormControl>
            <Textarea
              rows={3}
              className="text-base"
              placeholder="e.g., Use powerful words to inscribe into your subconscious., etc."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
