import React, { useCallback } from "react";
import { Label } from "@components/ui/label";
import TextAreaList from "@components/TextAreaList";

interface GreatTodayProps {
  entryList: string[];
  onChange: (value: string[]) => void;
}

const GreatToday = React.memo(({ entryList, onChange }: GreatTodayProps) => {
  const handleTextAreaListChange = useCallback(
    (newEntries: string[]) => {
      onChange(newEntries);
    },
    [onChange]
  );

  return (
    <div className="h-full flex flex-col mt-5">
      <Label className="w-full">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-full mb-2 text-muted-foreground">
              {"Generate Willpower for Today"}
            </div>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {"What will make today great?"}
            </h2>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <TextAreaList
            entryList={entryList}
            onChange={handleTextAreaListChange}
          />
        </div>
      </Label>
    </div>
  );
});

GreatToday.displayName = "GreatToday";

export default GreatToday;
