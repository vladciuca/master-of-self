import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Control } from "react-hook-form";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";

type NameFieldProps = {
  control: Control<HabitZodType>;
};

export function NameField({ control }: NameFieldProps) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mastery name</FormLabel>
          <FormControl>
            <Input
              className="text-base"
              placeholder="A consistent action you can take to improve..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
