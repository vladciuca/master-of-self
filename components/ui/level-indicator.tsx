import { PiArrowFatLinesUpFill, PiArrowFatLinesDownFill } from "react-icons/pi";

type LevelIndicatorProps = {
  currentLevel: number;
  level: number;
  positiveColor?: string;
  negativeColor?: string;
};

export function LevelIndicator({
  currentLevel,
  level,
  positiveColor = "lime-500",
  negativeColor = "rose-500",
}: LevelIndicatorProps) {
  return (
    <div>
      {currentLevel < level && (
        <PiArrowFatLinesUpFill className={`text-${positiveColor} ml-1`} />
      )}
      {currentLevel > level && (
        <PiArrowFatLinesDownFill className={`text-${negativeColor} ml-1`} />
      )}
    </div>
  );
}
