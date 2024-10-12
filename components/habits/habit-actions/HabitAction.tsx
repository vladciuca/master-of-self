import { ActionProgressSlider } from "@components/habits/habit-actions/ActionProgressSlider";
import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";
import { Card } from "@components/ui/card";

interface HabitActionProps {
  action: {
    id: string;
    type: "offensive" | "defensive";
    action: string;
    metric: "count" | "time";
    dailyTarget: number;
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
    <>
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="">
            <ActionIcon type={action.type} size={18} />
          </span>
          <span className="">{action.action}</span>
        </div>
      </div>
      <Card className="mt-2 mb-8 p-2">
        <div className="flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-baseline mx-2">
              Daily Target:
              <span className="text-primary ml-1">
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline ml-2">
                    <span className="flex items-baseline">
                      <MetricIcon metric={action.metric} size={16} />
                    </span>

                    <span className="ml-1 text-xl font-bold flex items-baseline text-primary">
                      {value}
                      {action.metric === "count" ? "" : " h"}
                    </span>
                  </div>
                </div>
              </span>
              /{action.dailyTarget}
            </div>
            <span className="text-lg font-bold">
              {value > 0 ? (
                <span className="text-green-500"> +{value}</span>
              ) : (
                <span>{value}</span>
              )}

              <span className="text-primary font-normal mx-1">XP</span>
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-8 my-6 mx-8">
          <Button
            variant="outline"
            size="icon"
            className="select-none h-8 w-8 shrink-0 rounded-full hover:bg-red-400"
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
              max={action.dailyTarget}
              onChange={(newValue) => handleActionChange(newValue)}
              startColor="#F59E0B"
              endColor="#22C55E"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`select-none h-8 w-8 shrink-0 rounded-full ${
              value >= 10 ? "bg-green-500" : ""
            } hover:bg-green-400`}
            onClick={() => handleActionChange(value + 1)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </Card>
    </>
  );
}
