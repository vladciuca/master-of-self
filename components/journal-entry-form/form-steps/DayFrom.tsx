import React from "react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";

interface DayFormProps {
  dailyWillpower: number;
  dayEntry: string;
  onChange: (
    field: "dailyWillpower" | "dayEntry",
    value: number | { myDay: string }
  ) => void;
}

const DayForm = ({ dailyWillpower, dayEntry, onChange }: DayFormProps) => {
  return (
    <div className="space-y-4">
      <Label className="w-full">
        Daily Willpower:
        <Input
          className="w-full mt-1"
          type="number"
          value={dailyWillpower}
          onChange={(e) =>
            onChange("dailyWillpower", Math.max(0, Number(e.target.value)))
          }
          min="0"
        />
      </Label>
      <Label className="w-full">
        Day Entry:
        <Textarea
          className="w-full mt-1"
          value={dayEntry}
          onChange={(e) => onChange("dayEntry", { myDay: e.target.value })}
        />
      </Label>
    </div>
  );
};

export default DayForm;
