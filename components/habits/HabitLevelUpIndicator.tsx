import { PiArrowFatLinesUpFill } from "react-icons/pi";

type HabitLevelUpIndicatorProps = {
  currentLevel: number;
  level: number;
};

export function HabitLevelUpIndicator({
  currentLevel,
  level,
}: HabitLevelUpIndicatorProps) {
  return (
    <div>
      {currentLevel < level && (
        <PiArrowFatLinesUpFill className="text-green-500 ml-1" />
      )}
    </div>
  );
}
