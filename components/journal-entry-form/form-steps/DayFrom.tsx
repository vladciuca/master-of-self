import React from "react";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";

interface DayFormProps {
  dayEntry: string;
  onChange: (field: "dayEntry", value: { myDay: string }) => void;
}

const DayForm: React.FC<DayFormProps> = ({ dayEntry, onChange }) => {
  return (
    <div className="space-y-4">
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
