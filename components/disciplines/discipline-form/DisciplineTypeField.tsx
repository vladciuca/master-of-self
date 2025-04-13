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

import { stepIconMap } from "@components/ui/constants";

type DisciplineTitleFieldProps = {
  control: Control<DisciplineZodType>;
  type: "Create" | "Update";
};

export function DisciplineTypeField({
  control,
  type,
}: DisciplineTitleFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          {type === "Create" && (
            <FormDescription className="text-xs">
              Type of discipline step
            </FormDescription>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="dayEntry">
                <span className="flex items-center">
                  {stepIconMap.day}
                  <span className="ml-2">Morning</span>
                </span>
              </SelectItem>
              <SelectItem value="nightEntry">
                <span className="flex items-center">
                  {stepIconMap.night}
                  <span className="ml-2">Evening</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
