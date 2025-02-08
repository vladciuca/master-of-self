// JOURNAL
export function calculateWillpowerScore(stringArray: string[]): number {
  const totalEntries = stringArray.length;
  const totalLength = stringArray.join("").length;
  return Math.floor((totalEntries * 5 + totalLength) / 10);
}

// HABITS ACTION VALUES

// export function displayActionValue(
//   value: number,
//   dailyTarget: number,
//   isDefensive: boolean
// ): number {
//   return isDefensive ? dailyTarget - value : value;
// }

// export function isDailyTargetCompleted(
//   value: number,
//   dailyTarget: number,
//   isDefensive: boolean
// ): boolean {
//   return isDefensive ? value === dailyTarget : value >= dailyTarget;
// }

// export function isActionOverCapped(
//   value: number,
//   dailyTarget: number,
//   isDefensive: boolean
// ): boolean {
//   return isDefensive ? value < 0 : value > 1.5 * dailyTarget;
// }

// export function getValueColor(
//   value: number,
//   dailyTarget: number,
//   isDefensive: boolean
// ): string {
//   if (isActionOverCapped(value, dailyTarget, isDefensive)) {
//     return isDefensive ? "text-red-500" : "text-orange-500";
//   }
//   if (isDailyTargetCompleted(value, dailyTarget, isDefensive)) {
//     return "text-green-500";
//   }
//   return "";
// }

type HabitActionValue = {
  value: number;
  dailyTarget: number;
  isDefensive: boolean;
};

export function displayActionValue({
  value,
  dailyTarget,
  isDefensive,
}: HabitActionValue): number {
  return isDefensive ? dailyTarget - value : value;
}

export function isDailyTargetCompleted({
  value,
  dailyTarget,
  isDefensive,
}: HabitActionValue): boolean {
  return isDefensive ? value === dailyTarget : value >= dailyTarget;
}

export function isActionOverCapped({
  value,
  dailyTarget,
  isDefensive,
}: HabitActionValue): boolean {
  return isDefensive ? value < 0 : value > 1.5 * dailyTarget;
}

export function getValueColor(params: HabitActionValue): string {
  if (isActionOverCapped(params)) {
    return params.isDefensive ? "text-red-500" : "text-orange-500";
  }
  if (isDailyTargetCompleted(params)) {
    return "text-green-500";
  }
  return "";
}
