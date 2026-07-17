import { PiArrowFatLinesUpFill, PiArrowFatLinesDownFill } from "react-icons/pi";
import { isHexColor } from "@lib/utils";

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
          className={`${isHexColor(positiveColor) ? "" : `text-${positiveColor}`} ml-1`}
          style={isHexColor(positiveColor) ? { color: positiveColor } : undefined}
          size={size}
        />
      )}
      {currentLevel > level && (
        <PiArrowFatLinesDownFill
          className={`${isHexColor(negativeColor) ? "" : `text-${negativeColor}`} ml-1`}
          style={isHexColor(negativeColor) ? { color: negativeColor } : undefined}
          size={size}
        />
      )}
    </div>
  );
}
