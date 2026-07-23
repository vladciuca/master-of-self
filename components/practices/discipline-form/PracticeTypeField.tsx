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
import { stepIconMap } from "@components/ui/constants";
import { IconRenderer } from "@components/IconRenderer";
import { Control } from "react-hook-form";
import { PracticeZodType } from "@models/practiceFormSchema";

type DisciplineTitleFieldProps = {
  control: Control<PracticeZodType>;
  type: "Create" | "Edit";
};

const TYPE_OPTIONS = [
  { value: "dayEntry", label: "Morning", icon: stepIconMap.day, color: "journal-day" },
  { value: "nightEntry", label: "Evening", icon: stepIconMap.night, color: "journal-night" },
] as const;

export function PracticeTypeField({
  control,
  type,
}: DisciplineTitleFieldProps) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => {
        const selectedOption = TYPE_OPTIONS.find((option) => option.value === field.value);

        return (
          <FormItem>
            <FormLabel>Time of Day</FormLabel>
            {type === "Create" && (
              <FormDescription className="text-xs">
                Choose when this page appears in your daily loop.
              </FormDescription>
            )}
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type">
                    {selectedOption && (
                      <span className="flex items-center">
                        <IconRenderer
                          iconName={selectedOption.icon}
                          size={20}
                          className={`mr-2 text-${selectedOption.color}`}
                        />
                        <span>{selectedOption.label}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-muted data-[highlighted]:bg-muted/30"
                  >
                    <span className="flex items-center">
                      <IconRenderer
                        iconName={option.icon}
                        size={20}
                        className={`mr-2 text-${option.color}`}
                      />
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
