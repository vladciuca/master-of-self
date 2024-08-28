import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { FaSun } from "react-icons/fa6";

interface GreatTodayProps {
  dayEntry: string;
  onChange: (field: "dayEntry", value: { greatToday: string }) => void;
}

const GreatToday = ({ dayEntry, onChange }: GreatTodayProps) => {
  return (
    <div className="space-y-4">
      <Label className="w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <FaSun className="mt-2 ml-2 text-muted-foreground" size={"1.5rem"} />
          <h2 className="my-5 mb-8 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {"What will make today great?"}
          </h2>
        </div>

        <Textarea
          className="w-full mt-1"
          value={dayEntry}
          onChange={(e) => onChange("dayEntry", { greatToday: e.target.value })}
        />
      </Label>
    </div>
  );
};

export default GreatToday;
