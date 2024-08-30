import React, { useCallback } from "react";
import { Label } from "@components/ui/label";
import TextAreaList from "@components/TextAreaList";

interface GreatTodayProps {
  dayEntry: string[];
  onChange: (
    field: "dayEntry",
    value: { greatToday: string[] },
    score: number
  ) => void;
}

const GreatToday = React.memo(({ dayEntry, onChange }: GreatTodayProps) => {
  const handleTextAreaListChange = useCallback(
    (newEntries: string[], score: number) => {
      onChange("dayEntry", { greatToday: newEntries }, score);
    },
    [onChange]
  );

  return (
    <div className="h-full flex flex-col mt-5">
      <Label className="w-full">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {"What will make today great?"}
            </h2>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <TextAreaList
            entries={dayEntry}
            onChange={handleTextAreaListChange}
          />
        </div>
      </Label>
    </div>
  );
});

GreatToday.displayName = "GreatToday";

export default GreatToday;
