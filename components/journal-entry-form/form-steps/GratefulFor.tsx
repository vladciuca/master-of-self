import React, { useCallback } from "react";
import TextAreaList from "@components/TextAreaList";
import { Label } from "@components/ui/label";
import { FaBoltLightning } from "react-icons/fa6";

interface GratefulForProps {
  dailyWillpower: number;
  entryList: string[];
  onChange: (value: string[]) => void;
}

const GratefulFor = React.memo(
  ({ dailyWillpower, entryList, onChange }: GratefulForProps) => {
    const handleTextAreaListChange = useCallback(
      (newEntries: string[]) => {
        onChange(newEntries);
      },
      [onChange]
    );

    return (
      <div className="h-full flex flex-col mt-2">
        <Label className="w-full">
          <div className="sticky top-0 bg-background z-10 pb-4">
            <div className="flex items-center justify-center">
              <div className="mr-2 text-muted-foreground">
                {"Generate Willpower:"}
              </div>
              <h2 className="text-lg font-semibold flex items-center justify-center">
                <FaBoltLightning />
                {dailyWillpower}
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
  }
);

GratefulFor.displayName = "GratefulFor";

export default GratefulFor;
