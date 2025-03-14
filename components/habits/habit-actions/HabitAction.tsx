import { motion, AnimatePresence } from "framer-motion";
import { HabitCardActionText } from "../habit-card/HabitCardActionText";
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
  getActionValueColor,
  displayActionValue,
} from "@lib/score";
import { applyWillpowerBonus } from "@lib/level";
import type { HabitAction } from "@models/types";

interface HabitActionProps {
  action: HabitAction;
  isActionBreak: boolean;
  value: number;
  onValueChange: (actionId: string, newValue: number) => void;
  totalWillpower: number;
  currentXp: number;
  projectedHabitXp: number;
}

export function HabitAction({
  action,
  isActionBreak,
  value,
  onValueChange,
  totalWillpower,
  currentXp,
  projectedHabitXp,
}: HabitActionProps) {
  const habitActionParams = {
    value,
    dailyTarget: action.dailyTarget,
    isActionBreak,
  };

  const valueColor = getActionValueColor(habitActionParams);

  const handleActionChange = (newValue: number) => {
    onValueChange(action.id, newValue);
  };

  // Modified XP calculation for decrease
  const getXpChangeForDecrease = () => {
    if (!isActionBreak) {
      // For offensive actions, losing 1 progress should cost 1 XP (before willpower)
      return applyWillpowerBonus(-1, totalWillpower);
    }

    // For defensive actions, calculate raw XP change first, then apply willpower
    const currentRawXp = action.dailyTarget - value;
    const newRawXp = action.dailyTarget - (value + 1);
    const xpDifference = newRawXp - currentRawXp;

    return applyWillpowerBonus(xpDifference, totalWillpower);
  };

  // Modified check for level one
  const wouldDropBelowLevelOne = () => {
    if (!isActionBreak) return false;

    const xpChange = getXpChangeForDecrease();
    const totalXpAfterChange = currentXp + projectedHabitXp + xpChange;

    // Add a small epsilon to handle floating point precision issues
    const epsilon = 0.0001;
    return totalXpAfterChange < -epsilon;
  };

  // Modified minus button disable logic
  const isMinusDisabled = isActionBreak
    ? value >= action.dailyTarget // Can't go above daily target for defensive actions
    : value <= 0 || wouldDropBelowLevelOne(); // Can't go below 0 or drop below level 1 for offensive

  // Plus button should only be disabled for defensive actions at their limit
  const isPlusDisabled = isActionBreak ? wouldDropBelowLevelOne() : false; // Allow unlimited progress for offensive actions

  return (
    <>
      <HabitCardActionText
        actionTask={action.task}
        actionIcon={
          <ActionIcon
            type={action.type}
            size={18}
            dailyTargetCompleted={isDailyTargetCompleted(habitActionParams)}
            overCapped={isActionOverCapped(habitActionParams)}
          />
        }
        actionType={action.type}
      />
      <Card className="mt-2 mb-8 p-2">
        <div className="flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-baseline">
              <span className="text-primary ml-1">
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline">
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
                {action.unit}
              </span>
            </div>
            <span className="text-lg font-bold">
              <XpDisplay xpValue={applyWillpowerBonus(value, totalWillpower)} />
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
              handleActionChange(isActionBreak ? value + 1 : value - 1)
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
              isActionBreak={isActionBreak}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="select-none h-8 w-8 shrink-0 rounded-full"
            disabled={isPlusDisabled}
            onClick={() =>
              handleActionChange(isActionBreak ? value - 1 : value + 1)
            }
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isActionBreak && isActionOverCapped(habitActionParams) && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className={`${valueColor} mt-2 text-sm text-center font-medium`}
              >
                Stop! You already reached your daily limit!
              </p>
            </motion.div>
          )}
          {!isActionBreak && isActionOverCapped(habitActionParams) && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className={`${valueColor} mt-2 text-sm text-center font-medium`}
              >
                On Fire! Don't overdo it or you'll burn out!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}
