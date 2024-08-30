import TextAreaList from "@components/TextAreaList";
import { Label } from "@components/ui/label";

interface DailyHighlightsProps {
  nightEntry: string[];
  onChange: (
    field: "nightEntry",
    value: { dailyHighlights: string[] },
    score: number
  ) => void;
}

const NightForm = ({ nightEntry, onChange }: DailyHighlightsProps) => {
  const handleTextAreaListChange = (newEntries: string[], score: number) => {
    onChange("nightEntry", { dailyHighlights: newEntries }, score);
  };

  return (
    <div className="h-full flex flex-col mt-5">
      <Label className="w-full">
        <div className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              {"What are your highlights of the day?"}
            </h2>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <TextAreaList
            entries={nightEntry}
            onChange={handleTextAreaListChange}
          />
        </div>
      </Label>
    </div>
  );
};

export default NightForm;
