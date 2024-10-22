import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { IconPicker } from "@components/IconPicker";
// import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
import { Control } from "react-hook-form";
import { HabitZodType } from "@components/habits/habit-form/habitFormSchema";

type IconPickerFieldProps = {
  control: Control<HabitZodType>;
  projectedXp?: number;
};

export function IconPickerField({
  control,
  projectedXp,
}: IconPickerFieldProps) {
  // const { iconColorClass, bgColorClass } = useIconRarityLevel(
  //   control._formValues.xp
  // );

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="w-full flex justify-center">
            Habit icon
          </FormLabel>
          <FormControl>
            <IconPicker
              value={field.value}
              onChange={(iconName) => field.onChange(iconName)}
              // iconColorClass={iconColorClass}
              // bgColorClass={bgColorClass}
              habitXp={control._formValues.xp}
              projectedXp={projectedXp}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
