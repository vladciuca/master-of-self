import React, { useCallback } from "react";
import TextAreaList from "@components/ui/TextAreaList";
import { Label } from "@components/ui/label";
import { FaBoltLightning } from "react-icons/fa6";

type GratefulForProps = {
  dailyWillpower: number;
  entryList: string[];
  onChange: (value: string[]) => void;
};

const GratefulFor = React.memo(
  ({ dailyWillpower, entryList, onChange }: GratefulForProps) => {
    const handleTextAreaListChange = useCallback(
      (newEntries: string[]) => {
        onChange(newEntries);
      },
      [onChange]
    );

    return (
      <div className="h-full flex flex-col">
        <Label className="w-full flex flex-col h-full mt-2">
          <div className="text-center sticky top-0 bg-background z-10">
            <div className="leading-relaxed text-muted-foreground mx-4">
              {
                "Use details to describe what you're feeling grateful for to generate Willpower"
              }
            </div>
            <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
              +{dailyWillpower}
              <FaBoltLightning className="ml-2" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto h-full mt-4 mx-4">
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
