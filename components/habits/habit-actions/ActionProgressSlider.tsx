import React, { useMemo } from "react";
import { HABIT_HEX_COLORS } from "@lib/colors";

interface ActionProgressSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  isActionBreak: boolean;
}

export function ActionProgressSlider({
  value,
  max,
  onChange,
  isActionBreak,
}: ActionProgressSliderProps) {
  // Define colors based on the action type
  const startColor = isActionBreak
    ? HABIT_HEX_COLORS.failedHex
    : HABIT_HEX_COLORS.mainHex;
  const endColor = isActionBreak
    ? HABIT_HEX_COLORS.mainHex
    : HABIT_HEX_COLORS.completedHex;

  // Generate colors once when the component mounts or when dependencies change
  const sliderColors = useMemo(() => {
    const generateColors = (start: string, end: string, steps: number) => {
      if (steps === 1) {
        return [end];
      }

      const result = [];
      for (let i = 0; i < steps; i++) {
        const r = Math.round(
          parseInt(start.slice(1, 3), 16) * (1 - i / (steps - 1)) +
            parseInt(end.slice(1, 3), 16) * (i / (steps - 1))
        );
        const g = Math.round(
          parseInt(start.slice(3, 5), 16) * (1 - i / (steps - 1)) +
            parseInt(end.slice(3, 5), 16) * (i / (steps - 1))
        );
        const b = Math.round(
          parseInt(start.slice(5, 7), 16) * (1 - i / (steps - 1)) +
            parseInt(end.slice(5, 7), 16) * (i / (steps - 1))
        );
        result.push(
          `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
        );
      }
      return result;
    };

    return generateColors(startColor, endColor, max);
  }, [max, startColor, endColor]);

  // Handle click events on the slider
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newValue = Math.round((x / rect.width) * max);
    onChange(Math.max(1, Math.min(newValue, max)));
  };

  return (
    <div
      className="relative w-full h-8 bg-muted rounded-full cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {Array.from({ length: max }, (_, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(index / max) * 100}%`,
            width: `${(1 / max) * 100}%`,
            backgroundColor:
              index < value ? sliderColors[index] : "transparent",
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
