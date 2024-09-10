import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";

type LearnedTodayProps = {
  learnedToday: string;
  onChange: (value: string) => void;
};

const LearnedToday = ({ learnedToday, onChange }: LearnedTodayProps) => {
  return (
    <div className="h-full flex flex-col">
      <Label // htmlFor="LearnedTodayTextArea"
        className="w-full flex flex-col h-full mt-2"
      >
        <div className="sticky top-0 bg-background z-10 pb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="leading-relaxed w-full px-4 mb-2 text-muted-foreground">
              {
                "If you could go back in time and change something, what would it be?"
              }
            </div>
          </div>
        </div>

        <div className="flex-grow h-full overflow-y-auto mt-4 mx-4">
          {/* <Textarea
            // id="LearnedTodayTextArea"
            value={learnedToday}
            onChange={(e) => onChange(e.target.value)}
            className="px-8 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          /> */}
          <textarea
            value={learnedToday}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent w-full px-8 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </Label>
    </div>
  );
};

export default LearnedToday;
