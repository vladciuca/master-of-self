import {
  CircleAlert,
  CircleCheck,
  // OctagonAlert,
  // BadgeAlert,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Hash,
} from "lucide-react";
// import { GiPointySword, GiSlashedShield } from "react-icons/gi";

type ActionIconProps = {
  type: "offensive" | "defensive";
  dailyTargetCompleted?: boolean;
  size?: number;
};

export function ActionIcon({
  type,
  dailyTargetCompleted = false,
  size,
}: ActionIconProps) {
  const iconSize = !size ? 22 : size;

  return (
    <>
      {!dailyTargetCompleted && (
        <>
          {type === "offensive" ? (
            <CircleAlert className="mr-2 text-blue-500" size={iconSize} />
          ) : (
            <ShieldAlert className="mr-2 text-blue-500" size={iconSize} />
          )}
        </>
      )}
      {dailyTargetCompleted && (
        <>
          {type === "offensive" ? (
            <CircleCheck className="mr-2 text-green-500" size={iconSize} />
          ) : (
            <ShieldCheck className="mr-2 text-green-500" size={iconSize} />
          )}
        </>
      )}
    </>
  );
}

type MetricIconProps = { metric: "count" | "time"; size?: number };

export function MetricIcon({ metric, size }: MetricIconProps) {
  const iconSize = !size ? 22 : size;
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
