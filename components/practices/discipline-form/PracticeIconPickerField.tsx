import { useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { IconPicker } from "@components/IconPicker";
// import { useIconRarityLevel } from "@hooks/useIconRarityLevel";
import { Control } from "react-hook-form";
import { PracticeZodType } from "@models/practiceFormSchema";

type DisciplineIconPickerFieldProps = {
  control: Control<PracticeZodType>;
  // xp?: number;
  // projectedXp?: number;
  type: "Create" | "Edit";
};

export function PracticeIconPickerField({
  control,
  // xp,
  // projectedXp,
  type,
}: DisciplineIconPickerFieldProps) {
  // const { iconColorClass, bgColorClass } = useIconRarityLevel(
  //   control._formValues.xp
  // );
  const selectedColor = useWatch({
    control,
    name: "color",
  });

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Icon</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Choose an icon that best resembles your practice.
            </FormDescription>
          )}
          <FormControl>
            <IconPicker
              value={field.value}
              onChange={(iconName) => field.onChange(iconName)}
              iconPickerType="practices"
              color={selectedColor}

              // habitXp={xp}
              // projectedXp={projectedXp}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
