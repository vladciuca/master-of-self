import React, { useCallback } from "react";
import { Label } from "@components/ui/label";
import { FaSun } from "react-icons/fa6";
import TextAreaList from "@components/TextAreaList";

interface GreatTodayProps {
  dayEntry: string[];
  onChange: (
    field: "dayEntry",
    value: { greatToday: string[] },
    score: number
  ) => void;
}

const GreatToday: React.FC<GreatTodayProps> = React.memo(
  ({ dayEntry, onChange }) => {
    const handleTextAreaListChange = useCallback(
      (newEntries: string[], score: number) => {
        onChange("dayEntry", { greatToday: newEntries }, score);
      },
      [onChange]
    );

    return (
      <div className="space-y-4">
        <Label className="w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <FaSun
              className="mt-2 ml-2 text-muted-foreground"
              size={"1.5rem"}
            />
            <h2 className="my-5 mb-8 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {"What will make today great?"}
            </h2>
          </div>

          <TextAreaList
            entries={dayEntry}
            onChange={handleTextAreaListChange}
          />
        </Label>
      </div>
    );
  }
);

GreatToday.displayName = "GreatToday";

export default GreatToday;
