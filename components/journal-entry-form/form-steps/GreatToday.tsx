import React, { useCallback } from "react";
import TextAreaList from "@components/TextAreaList";
import { Label } from "@components/ui/label";
import { FaBoltLightning } from "react-icons/fa6";

interface GreatTodayProps {
  dailyWillpower: number;
  bonusWillpower: number;
  entryList: string[];
  onChange: (value: string[]) => void;
}

const GreatToday = React.memo(
  ({
    dailyWillpower,
    bonusWillpower,
    entryList,
    onChange,
  }: GreatTodayProps) => {
    const handleTextAreaListChange = useCallback(
      (newEntries: string[]) => {
        onChange(newEntries);
      },
      [onChange]
    );

    return (
      <div className="h-full flex flex-col mt-2">
        <Label className="w-full">
          <div className="text-center sticky top-0 bg-background z-10">
            <span className="text-muted-foreground">
              {"Generate Willpower for today!"}
            </span>
            <div className="text-4xl my-3 flex items-center justify-center">
              <FaBoltLightning />
              {dailyWillpower}
            </div>
          </div>
          <div className="flex-grow overflow-y-auto mt-6">
            <TextAreaList
              entryList={entryList}
              onChange={handleTextAreaListChange}
            />
          </div>
        </Label>
      </div>
    );
  }
);

GreatToday.displayName = "GreatToday";

export default GreatToday;
