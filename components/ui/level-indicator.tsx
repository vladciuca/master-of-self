import { PiArrowFatLinesUpFill, PiArrowFatLinesDownFill } from "react-icons/pi";

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
  positiveColor = "lime-500",
  negativeColor = "rose-500",
  size = 16,
}: LevelIndicatorProps) {
  return (
    <div>
      {currentLevel < level && (
        <PiArrowFatLinesUpFill
          className={`text-${positiveColor} ml-1`}
          size={size}
        />
      )}
      {currentLevel > level && (
        <PiArrowFatLinesDownFill
          className={`text-${negativeColor} ml-1`}
          size={size}
        />
      )}
    </div>
  );
}
