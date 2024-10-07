import { ActionIcon } from "@components/habits/HabitActionFragments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Hash, Clock, Minus, Plus } from "lucide-react";

interface HabitActionProps {
  action: {
    id: string;
    type: "offensive" | "defensive";
    action: string;
    metric: "count" | "time";
  };
  value: number;
  onValueChange: (actionId: string, newValue: number) => void;
}

export function HabitAction({
  action,
  value,
  onValueChange,
}: HabitActionProps) {
  const handleActionChange = (newValue: number) => {
    onValueChange(action.id, newValue);
  };

  return (
    <div className="mx-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ActionIcon type={action.type} />
          {action.action}
        </div>
        <Badge variant="outline" className="capitalize">
          {action.metric === "count" ? (
            <Hash size={18} className="mr-2" />
          ) : (
            <Clock size={18} className="mr-2" />
          )}
          <span className="text-xl">{value}</span>
        </Badge>
      </div>
      <hr className="my-2" />
      <div className="flex justify-center items-center space-x-8 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          disabled={value <= 0}
          onClick={() => handleActionChange(value - 1)}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="w-full">
          <Slider
            value={[value]}
            max={10}
            step={1}
            disabled={value > 10}
            onValueChange={(newValue) => handleActionChange(newValue[0])}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => handleActionChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </div>
  );
}
