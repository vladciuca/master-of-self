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

export function NameField({ control, type }: NameFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Habit</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              {/* Choose a broad category that best describes the area you want to
              achieve mastery in. This helps with maintaining consistency while
              allowing flexibility, so you can adapt without breaking the habit
              chain—making it easier to build lasting habits over time. */}
              Choose a broad area of improvement. This represents the skill or
              habit you want to build mastery in over time.
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
