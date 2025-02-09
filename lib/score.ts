// JOURNAL
export function calculateWillpowerScore(stringArray: string[]): number {
  const totalEntries = stringArray.length;
  const totalLength = stringArray.join("").length;
  return Math.floor((totalEntries * 5 + totalLength) / 10);
}

// HABITS ACTION VALUES
import type { HabitAction, ActionItem } from "@app/types/types";

type HabitActionValueParams = {
  value: number;
  dailyTarget: number;
  isDefensiveAction: boolean;
};

type HabitActionValueFallbackParams = {
  action: HabitAction;
  actionUpdateValues: ActionItem;
};

export function getActionValueWithFallback({
  action,
  actionUpdateValues,
}: HabitActionValueFallbackParams) {
  const isDefensiveAction = action.type === "defensive";
  return (
    actionUpdateValues[action.id] ??
    (isDefensiveAction ? action.dailyTarget : 0)
  );
}

export function displayActionValue({
  value,
  dailyTarget,
  isDefensiveAction,
}: HabitActionValueParams): number {
  return isDefensiveAction ? dailyTarget - value : value;
}

export function isDailyTargetCompleted({
  value,
  dailyTarget,
}: HabitActionValueParams): boolean {
  return value >= dailyTarget;
}

const BURN_OUT_MULTIPLIER = 1.5;

export function isActionOverCapped({
  value,
  dailyTarget,
  isDefensiveAction,
}: HabitActionValueParams): boolean {
  return isDefensiveAction
    ? value < 0
    : value > BURN_OUT_MULTIPLIER * dailyTarget;
}

export function getValueColor(params: HabitActionValueParams): string {
  if (isActionOverCapped(params)) {
    return params.isDefensiveAction ? "text-red-500" : "text-orange-500";
  }

  if (isDailyTargetCompleted(params)) {
    return "text-green-500";
  }

  return "text-primary";
}
