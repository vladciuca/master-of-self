import { PiArrowFatLinesUpFill, PiArrowFatLinesDownFill } from "react-icons/pi";

type HabitLevelIndicatorProps = {
  currentLevel: number;
  level: number;
};

export function HabitLevelIndicator({
  currentLevel,
  level,
}: HabitLevelIndicatorProps) {
  return (
    <div>
      {currentLevel < level && (
        <PiArrowFatLinesUpFill className="text-green-500 ml-1" />
      )}
      {currentLevel > level && (
        <PiArrowFatLinesDownFill className="text-red-500 ml-1" />
      )}
    </div>
  );
}
