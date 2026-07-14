import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, useFormContext } from "react-hook-form";
import { DisciplineZodType } from "@models/disciplineFormSchema";
import { DISCIPLINES } from "@lib/disciplines";

type DisciplineNameFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

function DisciplineColorDot({ color }: { color: string }) {
  return (
    <div
      className={`w-4 h-4 rounded-md flex-shrink-0 bg-${color}`}
      aria-hidden="true"
    />
  );
}

export function DisciplineNameField({
  control,
  type,
}: DisciplineNameFieldProps) {
  const { setValue } = useFormContext<DisciplineZodType>();

  const selectableDisciplines = DISCIPLINES.filter(
    (discipline) => discipline.discipline !== "Discipline"
  );

  const handleDisciplineChange = (value: string) => {
    const disciplineConfig = selectableDisciplines.find(
      (discipline) => discipline.discipline === value
    );

    if (disciplineConfig?.color) {
      setValue("color", disciplineConfig.color, { shouldValidate: true });
    }

    setValue("discipline", value, { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name="discipline"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discipline</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Select the personal trait or quality you want to develop.
            </FormDescription>
          )}

          <Select
            onValueChange={handleDisciplineChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a discipline">
                  {field.value && (
                    (() => {
                      const selected = selectableDisciplines.find(
                        (d) => d.discipline === field.value
                      );
                      return (
                        <div className="flex items-center gap-2">
                          {selected && (
                            <DisciplineColorDot color={selected.color ?? "primary"} />
                          )}
                          <span>{field.value}</span>
                        </div>
                      );
                    })()
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectableDisciplines.map((discipline) => (
                <SelectItem
                  key={discipline.discipline}
                  value={discipline.discipline}
                  className="hover:bg-muted data-[highlighted]:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <DisciplineColorDot color={discipline.color ?? "primary"} />
                    <span>{discipline.discipline}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
