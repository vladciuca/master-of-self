import {
  CircleAlert,
  // OctagonAlert,
  // BadgeAlert,
  ShieldAlert,
  Clock,
  Hash,
} from "lucide-react";
// import { GiPointySword, GiSlashedShield } from "react-icons/gi";

type ActionIconProps = { type: "offensive" | "defensive"; size?: number };

export function ActionIcon({ type, size }: ActionIconProps) {
  const iconSize = !size ? 22 : size;
  return (
    <>
      {type === "offensive" ? (
        <CircleAlert className="mr-2 text-blue-500" size={iconSize} />
      ) : (
        <ShieldAlert className="mr-2 text-blue-500" size={iconSize} />
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
