import type React from "react";
import { useMemo } from "react";
import { displayActionValue } from "@lib/score";

interface ActionProgressSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  isDefensive: boolean;
}

export function ActionProgressSlider({
  value,
  max,
  onChange,
  isDefensive,
}: ActionProgressSliderProps) {
  // Define colors based on the action type
  const startColor = isDefensive ? "#EF4444" : "#3B82F6";
  const endColor = isDefensive ? "#3B82F6" : "#22C55E";

  // Generate colors once when the component mounts or when dependencies change
  const sliderColors = useMemo(() => {
    const generateColors = (start: string, end: string, steps: number) => {
      if (steps === 1) {
        return [end];
      }

      const result = [];
      for (let i = 0; i < steps; i++) {
        const r = Math.round(
          Number.parseInt(start.slice(1, 3), 16) * (1 - i / (steps - 1)) +
            Number.parseInt(end.slice(1, 3), 16) * (i / (steps - 1))
        );
        const g = Math.round(
          Number.parseInt(start.slice(3, 5), 16) * (1 - i / (steps - 1)) +
            Number.parseInt(end.slice(3, 5), 16) * (i / (steps - 1))
        );
        const b = Math.round(
          Number.parseInt(start.slice(5, 7), 16) * (1 - i / (steps - 1)) +
            Number.parseInt(end.slice(5, 7), 16) * (i / (steps - 1))
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

    // If defensive, invert the value
    const adjustedValue = isDefensive ? max - newValue : newValue;
    onChange(Math.max(1, Math.min(adjustedValue, max)));
  };

  const actionParams = { value, dailyTarget: max, isDefensive };
  // Calculate the effective value for display (reverse if defensive)
  const displayValue = displayActionValue(actionParams);

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
              index < displayValue ? sliderColors[index] : "transparent",
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
