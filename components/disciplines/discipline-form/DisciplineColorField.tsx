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
import { Control } from "react-hook-form";
import { DisciplineZodType } from "@models/disciplineFormSchema";

import { DISCIPLINE_COLORS } from "@lib/colors";

type DisciplineColorFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

const mapDisciplineColorsToTailwind = (colorsObj: Record<string, string>) =>
  Object.entries(colorsObj).map(([name, value]) => ({ name, value }));

const tailwindColors = mapDisciplineColorsToTailwind(DISCIPLINE_COLORS);

export function DisciplineColorField({
  control,
  type,
}: DisciplineColorFieldProps) {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Color</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Select a color for your discipline
            </FormDescription>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a color">
                  {field.value && (
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-md mr-2 bg-${field.value}`}
                      />
                      <span className="capitalize">
                        {field.value?.replace(/-\d+$/, "")}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="flex justify-center p-2">
                <div className="grid [grid-template-columns:repeat(auto-fit,_minmax(2rem,_1fr))] gap-2 w-full max-w-screen-xs">
                  {tailwindColors.map((color) => (
                    <SelectItem
                      key={color.value}
                      value={color.value}
                      className="p-0 m-0 h-auto focus:bg-transparent data-[highlighted]:bg-transparent"
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-md cursor-pointer bg-${color.value} hover:opacity-80 transition-opacity`}
                          title={color.name}
                        />
                        {field.value === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
