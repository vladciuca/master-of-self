import { IconRenderer } from "@components/IconRenderer";
import { CircularProgress } from "@components/ui/circular-progress";
interface HabitProgressBarProps {
  icon: string;
  xp: number;
  currentProgressPercentage: number;
  xpGainProgressPercentage: number;
}

export function HabitProgressBar({
  icon,
  xp,
  currentProgressPercentage,
  xpGainProgressPercentage,
}: HabitProgressBarProps) {
  return (
    <div className="relative flex items-center justify-center h-full w-full">
      <CircularProgress
        className="ml-4"
        value={currentProgressPercentage}
        xpGainValue={xpGainProgressPercentage}
        strokeWidth={6}
        circleSize={70}
      />
      <div
        className="absolute w-full flex flex-col"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="flex flex-col items-center justify-center text-xs"
          style={{ pointerEvents: "none" }}
        >
          <div className="-z-10">
            <IconRenderer
              iconName={icon}
              className="text-4xl rounded-full bg-transparent"
              xp={xp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
