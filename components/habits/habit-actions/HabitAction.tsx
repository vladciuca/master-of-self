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
  willpowerMultiplier: number;
}

export function HabitAction({
  action,
  value,
  onValueChange,
  willpowerMultiplier,
}: HabitActionProps) {
  const handleActionChange = (newValue: number) => {
    onValueChange(action.id, newValue);
  };

  return (
    <>
      <div className="mb-1 flex items-start max-w-full">
        <span className="flex flex-shrink-0 items-start mt-[3.2px]">
          <ActionIcon
            type={action.type}
            size={18}
            dailyTargetCompleted={value >= action.dailyTarget}
          />
        </span>
        <span className="text-base break-words whitespace-normal w-0 flex-grow">
          {action.action}
        </span>
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
                <span className="text-green-500">
                  +{Math.round(value * willpowerMultiplier)}
                </span>
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
              startColor="#3B82F6"
              endColor="#22C55E"
              // startColor="#F59E0B"
              // startColor="#EC4899"
              // endColor="#8B5CF6"
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
