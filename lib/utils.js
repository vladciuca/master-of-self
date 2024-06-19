import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  console.log("in ea");
  console.log(clsx);
  return twMerge(clsx(inputs));
}
