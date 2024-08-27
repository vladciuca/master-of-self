import React from "react";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";

interface NightFormProps {
  nightEntry: string;
  onChange: (field: "nightEntry", value: { myNight: string }) => void;
}

const NightForm = ({ nightEntry, onChange }: NightFormProps) => {
  return (
    <div className="space-y-4">
      <Label className="w-full">
        Night Entry:
        <Textarea
          className="w-full mt-1"
          value={nightEntry}
          onChange={(e) => onChange("nightEntry", { myNight: e.target.value })}
        />
      </Label>
    </div>
  );
};

export default NightForm;
