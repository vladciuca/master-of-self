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

// New function to extract icon name from React element
export function stringFromIcon(icon: React.ReactElement): string {
  if (!icon || !icon.type) {
    return "GiInnerSelf"; // Default fallback
  }

  // Get the display name or function name of the component
  const iconType = icon.type as any;
  const componentName = iconType.displayName || iconType.name;

  // Return the component name if found
  if (componentName) {
    return componentName;
  }

  // Fallback: Try to infer from the component's toString() result
  // const stringRepresentation = iconType.toString();
  // if (stringRepresentation.includes('GiHealing')) {
  //   return 'GiHealing';
  // } else if (stringRepresentation.includes('FaSun')) {
  //   return 'FaSun';
  // } else if (stringRepresentation.includes('FaMoon')) {
  //   return 'FaMoon';
  // }
  // Add more mappings as needed

  console.warn("Could not determine icon name", icon);
  return "GiInnerSelf"; // Default fallback
}
