import { PiArrowFatLinesUpFill, PiArrowFatLinesDownFill } from "react-icons/pi";
import { getRuntimeColorProps } from "@lib/colors";

type LevelIndicatorProps = {
  currentLevel: number;
  level: number;
  positiveColor?: string;
  negativeColor?: string;
  size?: number;
};

export function LevelIndicator({
  currentLevel,
  level,
  positiveColor = "xp-positive",
  negativeColor = "xp-negative",
  size = 16,
}: LevelIndicatorProps) {
  const positiveProps = getRuntimeColorProps(positiveColor, "text");
  const negativeProps = getRuntimeColorProps(negativeColor, "text");

  return (
    <div>
      {currentLevel < level && (
        <PiArrowFatLinesUpFill
          className={`${positiveProps.className ?? ""} ml-1`}
          style={positiveProps.style}
          size={size}
        />
      )}
      {currentLevel > level && (
        <PiArrowFatLinesDownFill
          className={`${negativeProps.className ?? ""} ml-1`}
          style={negativeProps.style}
          size={size}
        />
      )}
    </div>
  );
}
