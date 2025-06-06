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
import { HabitZodType } from "@models/habitFormSchema";

type IconPickerFieldProps = {
  control: Control<HabitZodType>;
  xp?: number;
  projectedXp?: number;
  type: "Create" | "Update";
  isHabitPicker?: boolean;
};

export function IconPickerField({
  control,
  xp,
  projectedXp,
  type,
  isHabitPicker,
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
          {type === "Create" && (
            <FormLabel className="w-full flex justify-center">
              Habit Icon
            </FormLabel>
          )}
          <FormControl>
            <IconPicker
              isHabitPicker={isHabitPicker}
              value={field.value}
              onChange={(iconName) => field.onChange(iconName)}
              iconPickerType="habits"
              // iconColorClass={iconColorClass}
              // bgColorClass={bgColorClass}
              // habitXp={control._formValues.xp}
              habitXp={xp}
              projectedXp={projectedXp}
            />
          </FormControl>
          <div className="text-center w-full">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
