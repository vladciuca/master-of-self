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
import { HabitZodType } from "@models/habitFormSchema";

type NameFieldProps = {
  control: Control<HabitZodType>;
  type: "Create" | "Update";
};

export function CategoryNameField({ control, type }: NameFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Habit Category</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Choose a broad category that best describes the area you want to
              achieve mastery in. This helps with organizing and tracking
              similar habits together.
            </FormDescription>
          )}

          <FormControl>
            <Input
              className="text-base"
              placeholder="e.g., Fitness, Mental Health, Finance, etc."
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
