import { motion, AnimatePresence } from "framer-motion";
import { ActionProgressSlider } from "@components/habits/habit-actions/ActionProgressSlider";
import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { XpDisplay } from "@components/ui/xp-display";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Card } from "@components/ui/card";
import {
  isDailyTargetCompleted,
  isActionOverCapped,
  getValueColor,
  displayActionValue,
} from "@lib/score";
import type { HabitAction } from "@app/types/types";

interface HabitActionProps {
  action: HabitAction;
  isDefensiveAction: boolean;
  value: number;
  onValueChange: (actionId: string, newValue: number) => void;
  willpowerMultiplier: number;
  currentXp: number;
  projectedHabitXp: number;
}

export function HabitAction({
  action,
  isDefensiveAction,
  value,
  onValueChange,
  willpowerMultiplier,
  currentXp,
  projectedHabitXp,
}: HabitActionProps) {
  const habitActionParams = {
    value,
    dailyTarget: action.dailyTarget,
    isDefensiveAction,
  };

  const valueColor = getValueColor(habitActionParams);

  const handleActionChange = (newValue: number) => {
    onValueChange(action.id, newValue);
  };

  // Calculate the XP that would be lost if we decrease the value
  const getXpChangeForDecrease = () => {
    if (!isDefensiveAction) return willpowerMultiplier;

    // For defensive actions, calculate how much XP would be lost
    const currentActionXp = (action.dailyTarget - value) * willpowerMultiplier;
    const newActionXp =
      (action.dailyTarget - (value + 1)) * willpowerMultiplier;
    return newActionXp - currentActionXp;
  };

  // Check if decreasing would drop below level 1
  const wouldDropBelowLevelOne = () => {
    if (!isDefensiveAction) return false;

    const xpChange = getXpChangeForDecrease();
    const totalXpAfterChange = currentXp + projectedHabitXp + xpChange;

    // Level 1 requires 0 XP, so we just need to check if we'd go negative
    return totalXpAfterChange < 0;
  };

  // Determine if the minus button should be disabled
  const isMinusDisabled = isDefensiveAction
    ? value >= action.dailyTarget
    : value <= 0;

  // Plus button should be disabled if increasing would drop below level 1
  const isPlusDisabled = wouldDropBelowLevelOne();

  return (
    <>
      <div className="mb-1 flex items-start max-w-full">
        <span className="flex flex-shrink-0 items-start mt-[3.2px]">
          <ActionIcon
            type={action.type}
            size={18}
            dailyTargetCompleted={isDailyTargetCompleted(habitActionParams)}
            overCapped={isActionOverCapped(habitActionParams)}
          />
        </span>
        <span className="font-bold mr-2">
          {isDefensiveAction ? "I won't" : "I will"}
        </span>
        <span className="text-base break-words whitespace-normal w-0 flex-grow">
          {action.action}
        </span>
      </div>
      <Card className="mt-2 mb-8 p-2">
        <div className="flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-baseline mx-2">
              <span className="text-primary ml-1">
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline ml-2">
                    <span className="flex items-baseline">
                      <MetricIcon metric={action.metric} size={16} />
                    </span>

                    <span
                      className={`ml-1 text-xl font-bold flex items-baseline ${valueColor}`}
                    >
                      {/* Just for Displaying the Value */}
                      {/* For defensive actions, displayValue shows remaining actions (dailyTarget - value) */}
                      {/* For offensive actions, displayValue shows completed actions (value) */}
                      {displayActionValue(habitActionParams)}
                    </span>
                  </div>
                </div>
              </span>
              /{action.dailyTarget}
              <span className="ml-2 text-xl font-bold text-primary">
                {action.actionUnit}
              </span>
            </div>
            <span className="text-lg font-bold">
              <XpDisplay xpValue={Math.round(value * willpowerMultiplier)} />
              <span className="text-primary font-normal mx-1">XP</span>
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center space-x-8 my-6 mx-8">
          <Button
            variant="outline"
            size="icon"
            className="select-none h-8 w-8 shrink-0 rounded-full"
            disabled={isMinusDisabled}
            onClick={() =>
              handleActionChange(isDefensiveAction ? value + 1 : value - 1)
            }
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>

          <div className="w-full">
            <ActionProgressSlider
              value={value}
              max={action.dailyTarget}
              onChange={(newValue) => handleActionChange(newValue)}
              isDefensiveAction={isDefensiveAction}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="select-none h-8 w-8 shrink-0 rounded-full"
            disabled={isPlusDisabled}
            onClick={() =>
              handleActionChange(isDefensiveAction ? value - 1 : value + 1)
            }
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isDefensiveAction && isActionOverCapped(habitActionParams) && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-red-500 mt-2 text-sm text-center font-medium">
                Stop! You already reached your daily limit!
              </p>
            </motion.div>
          )}
          {!isDefensiveAction && isActionOverCapped(habitActionParams) && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-orange-500 mt-2 text-sm text-center font-medium">
                On Fire! Don't overdo it or you'll burn out!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}
