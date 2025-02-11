// JOURNAL
export function calculateWillpowerScore(stringArray: string[]): number {
  const totalEntries = stringArray.length;
  const totalLength = stringArray.join("").length;
  return Math.floor((totalEntries * 5 + totalLength) / 10);
}

// HABITS ACTION VALUES
type HabitActionValueParams = {
  value: number;
  dailyTarget: number;
  isDefensiveAction: boolean;
};

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

export function getActionValueColor(params: HabitActionValueParams): string {
  if (isActionOverCapped(params)) {
    return params.isDefensiveAction ? "text-red-500" : "text-orange-500";
  }

  if (isDailyTargetCompleted(params)) {
    return "text-green-500";
  }

  return "text-primary";
}
