import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { IconPicker } from "@components/IconPicker";
import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
import { Control } from "react-hook-form";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";

type IconPickerFieldProps = {
  control: Control<HabitZodType>;
};

export function IconPickerField({ control }: IconPickerFieldProps) {
  const { iconColorClass, bgColorClass } = useIconRarityLevel(
    control._formValues.xp
  );

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Habit Icon</FormLabel>
          <FormControl>
            <IconPicker
              value={field.value}
              onChange={(iconName) => field.onChange(iconName)}
              iconColorClass={iconColorClass}
              bgColorClass={bgColorClass}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
