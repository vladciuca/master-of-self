import TextAreaList from "@components/ui/TextAreaList";
import { Label } from "@components/ui/label";

type DailyHighlightsProps = {
  entryList: string[];
  onChange: (value: string[]) => void;
};

const DailyHighlights = ({ entryList, onChange }: DailyHighlightsProps) => {
  const handleTextAreaListChange = (newEntries: string[]) => {
    onChange(newEntries);
  };

  return (
    <div className="h-full flex flex-col">
      <Label className="w-full flex flex-col h-full mt-2">
        <div className="mb-4 text-center leading-relaxed text-muted-foreground mx-4">
          {
            "Build momentum by capturing meaningful events to boost tomorrow's Willpower"
          }
        </div>
        <div className="flex-grow h-full overflow-y-auto mx-4">
          <TextAreaList
            entryList={entryList}
            onChange={handleTextAreaListChange}
          />
        </div>
      </Label>
    </div>
  );
};

export default DailyHighlights;
