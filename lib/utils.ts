import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumberSuffixes(number: number): string {
  if (number < 1000) {
    return number.toString();
  }

  const suffixes: string[] = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    suffixIndex++;
    number /= 1000;
  }

  return `${number.toFixed(1).replace(/\.0$/, "")}${suffixes[suffixIndex]}`;
}
