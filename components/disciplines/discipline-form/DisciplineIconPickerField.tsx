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
import { DisciplineZodType } from "@models/disciplineFormSchema";

type DisciplineIconPickerFieldProps = {
  control: Control<DisciplineZodType>;
  // xp?: number;
  // projectedXp?: number;
  type: "Create" | "Update";
};

export function DisciplineIconPickerField({
  control,
  // xp,
  // projectedXp,
  type,
}: DisciplineIconPickerFieldProps) {
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
              Discipline Icon
            </FormLabel>
          )}
          <FormControl>
            <IconPicker
              value={field.value}
              onChange={(iconName) => field.onChange(iconName)}
              iconPickerType="disciplines"

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
