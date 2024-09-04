import TextAreaList from "@components/ui/TextAreaList";
import { Label } from "@components/ui/label";

interface DailyHighlightsProps {
  entryList: string[];
  onChange: (value: string[]) => void;
}

const DailyHighlights = ({ entryList, onChange }: DailyHighlightsProps) => {
  const handleTextAreaListChange = (newEntries: string[]) => {
    onChange(newEntries);
  };

  return (
    <div className="h-full flex flex-col">
      <Label className="w-full flex flex-col h-full mt-2">
        <div className="flex-grow h-full overflow-y-auto">
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
