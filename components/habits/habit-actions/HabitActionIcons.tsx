import {
  Flame,
  Clock,
  Hash,
  Circle,
  CircleDashed,
  CircleMinus,
} from "lucide-react";
import { HABIT_COLORS } from "@lib/colors";

type ActionIconProps = {
  type: "build" | "break";
  dailyTargetCompleted?: boolean;
  overCapped?: boolean;
  size?: number;
};

export function ActionIcon({
  type,
  dailyTargetCompleted,
  overCapped,
  size,
}: ActionIconProps) {
  const iconSize = size || 22;
  const iconColor = overCapped
    ? type === "break"
      ? `text-${HABIT_COLORS.failed}`
      : `text-${HABIT_COLORS.burnedOut}`
    : dailyTargetCompleted
    ? `text-${HABIT_COLORS.completed}`
    : `text-${HABIT_COLORS.main}`;

  return (
    <>
      {overCapped && (
        <>
          {type === "build" ? (
            <Flame className={`${iconColor}`} size={iconSize} />
          ) : (
            <CircleMinus className={`${iconColor}`} size={iconSize} />
          )}
        </>
      )}
      {!overCapped && !dailyTargetCompleted && (
        <>
          {type === "build" ? (
            <CircleDashed className={`${iconColor}`} size={iconSize} />
          ) : (
            <Circle className={`${iconColor}`} size={iconSize} />
          )}
        </>
      )}
      {!overCapped && dailyTargetCompleted && (
        <>
          {type === "build" ? (
            <Circle className={`${iconColor}`} size={iconSize} />
          ) : (
            <CircleDashed className={`${iconColor}`} size={iconSize} />
          )}
        </>
      )}
    </>
  );
}

type MetricIconProps = { metric: "count" | "time"; size?: number };

export function MetricIcon({ metric, size }: MetricIconProps) {
  const iconSize = size || 22;
  return (
    <>
      {metric === "count" ? (
        <Hash className="text-primary" size={iconSize} />
      ) : (
        <Clock className="text-primary" size={iconSize} />
      )}
    </>
  );
}
