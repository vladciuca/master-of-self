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
import { PracticeZodType } from "@models/practiceFormSchema";

import { normalizeLegacyColor } from "@lib/utils";

const DISCIPLINE_COLORS: Record<string, string> = {
  red: "#EF4444",
  orange: "#F97316",
  amber: "#F59E0B",
  yellow: "#EAB308",
  lime: "#84CC16",
  green: "#22C55E",
  emerald: "#10B981",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  sky: "#0EA5E9",
  blue: "#3B82F6",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  purple: "#A855F7",
  fuchsia: "#D946EF",
  pink: "#EC4899",
  rose: "#F43F5E",
};

type DisciplineColorFieldProps = {
  control: Control<PracticeZodType>;
  type: "Create" | "Edit";
};

const tailwindColors = Object.entries(DISCIPLINE_COLORS).map(
  ([name, value]) => ({ name, value })
);

const hexToNameMap = Object.fromEntries(
  Object.entries(DISCIPLINE_COLORS).map(([name, hex]) => [hex, name])
);

export function PracticeColorField({
  control,
  type,
}: DisciplineColorFieldProps) {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => {
        const normalizedValue = normalizeLegacyColor(field.value);
        const displayName = hexToNameMap[normalizedValue] ?? "Custom";

        return (
          <FormItem>
            <FormLabel>Color</FormLabel>
            {type === "Create" && (
              <FormDescription className="text-xs">
                Select a color for your discipline.
              </FormDescription>
            )}
            <Select
              onValueChange={field.onChange}
              value={normalizedValue || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color">
                    {normalizedValue && (
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-md mr-2"
                          style={{ backgroundColor: normalizedValue }}
                        />
                        <span className="capitalize">{displayName}</span>
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
                            className="w-8 h-8 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                          {normalizedValue === color.value && (
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
        );
      }}
    />
  );
}
