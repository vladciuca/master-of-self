import React from "react";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { FaMoon } from "react-icons/fa6";

interface DailyHighlightsProps {
  nightEntry: string;
  onChange: (field: "nightEntry", value: { dailyHighlights: string }) => void;
}

const NightForm = ({ nightEntry, onChange }: DailyHighlightsProps) => {
  return (
    <div className="space-y-4">
      <Label className="w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <FaMoon className="mt-2 ml-2 text-muted-foreground" size={"1.5rem"} />
          <h2 className="my-5 mb-8 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {"What are your highlights of the day?"}
          </h2>
        </div>

        <Textarea
          className="w-full mt-1"
          value={nightEntry}
          onChange={(e) =>
            onChange("nightEntry", { dailyHighlights: e.target.value })
          }
        />
      </Label>
    </div>
  );
};

export default NightForm;
