import { useWatch } from "react-hook-form";
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
import { PracticeZodType } from "@models/practiceFormSchema";

type DisciplineIconPickerFieldProps = {
  control: Control<PracticeZodType>;
  // xp?: number;
  // projectedXp?: number;
  type: "Create" | "Update";
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
          {type === "Create" && (
            <FormLabel className="w-full flex justify-center">
              Icon
            </FormLabel>
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
          <div className="text-center w-full">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
