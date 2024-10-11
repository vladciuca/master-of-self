import { ActionProgressSlider } from "@components/CustomSlider";
import { ActionIcon } from "@components/habits/HabitActionFragments";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
import { Hash, Clock, Minus, Plus } from "lucide-react";
import { Card } from "@components/ui/card";

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
    <Card className="p-4 mb-4">
      <div className="flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b">
          <div className="flex items-center">
            <span className="flex items-center">
              <ActionIcon type={action.type} size={28} />
              {/* <Badge variant="secondary" className="mr-2">
                {action.type === "offensive" ? "I will" : "I won't"}
              </Badge> */}
            </span>
            <span className=" text-lg">{action.action}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xl flex items-center">
              <span className="font-bold flex items-center text-primary">
                {value}
                {action.metric === "count" ? "" : " h"}
              </span>
              {action.metric === "count" ? (
                <Hash size={18} className="ml-1 text-primary" />
              ) : (
                <Clock size={18} className="ml-1" />
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between text-sm text-muted-foreground mb-2">
          {/* <Badge variant="secondary" className="capitalize">
            {action.type}
          </Badge> */}
          <span>
            Daily Target:
            <span className="text-primary ml-1">{value}</span>/10
          </span>

          <span className="text-green-500">
            +{value}
            <span className="text-primary mx-1">XP</span>
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-6 mt-4 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full hover:bg-red-400"
          disabled={value <= 0}
          onClick={() => handleActionChange(value - 1)}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease</span>
        </Button>
        <div className="w-full">
          {/* <Slider
            value={[value]}
            max={10}
            step={1}
            disabled={value > 10}
            onValueChange={(newValue) => handleActionChange(newValue[0])}
            className="w-full"
          /> */}
          <ActionProgressSlider
            value={value}
            max={10}
            onChange={(newValue) => handleActionChange(newValue)}
            startColor="#FFA500"
            endColor="#22C55E"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 shrink-0 rounded-full ${
            value >= 10 ? "bg-green-500" : ""
          } hover:bg-green-400`}
          onClick={() => handleActionChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase</span>
        </Button>
      </div>
    </Card>
  );
}
