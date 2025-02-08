// import {
//   CircleAlert,
//   CircleCheck,
//   // OctagonAlert,
//   // BadgeAlert,
//   ShieldAlert,
//   ShieldCheck,
//   ShieldX,
//   Clock,
//   Hash,
// } from "lucide-react";

// type ActionIconProps = {
//   type: "offensive" | "defensive";
//   dailyTargetCompleted?: boolean;
//   overCapped?: boolean;
//   size?: number;
// };

// export function ActionIcon({
//   type,
//   dailyTargetCompleted,
//   size,
// }: ActionIconProps) {
//   const iconSize = !size ? 22 : size;

//   console.log("====dailyTargetCompleted", dailyTargetCompleted);

//   return (
//     <>
//       {!dailyTargetCompleted && (
//         <>
//           {type === "offensive" ? (
//             <CircleAlert className="mr-2 text-blue-500" size={iconSize} />
//           ) : (
//             <ShieldAlert className="mr-2 text-blue-500" size={iconSize} />
//           )}
//         </>
//       )}
//       {dailyTargetCompleted && (
//         <>
//           {type === "offensive" ? (
//             <CircleCheck className="mr-2 text-green-500" size={iconSize} />
//           ) : (
//             <ShieldCheck className="mr-2 text-green-500" size={iconSize} />
//           )}
//         </>
//       )}
//     </>
//   );
// }

// type MetricIconProps = { metric: "count" | "time"; size?: number };

// export function MetricIcon({ metric, size }: MetricIconProps) {
//   const iconSize = !size ? 22 : size;
//   return (
//     <>
//       {metric === "count" ? (
//         <Hash className="text-primary" size={iconSize} />
//       ) : (
//         <Clock className="text-primary" size={iconSize} />
//       )}
//     </>
//   );
// }
import {
  CircleAlert,
  CircleCheck,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Hash,
  ShieldX,
  CircleX,
  Flame,
} from "lucide-react";

type ActionIconProps = {
  type: "offensive" | "defensive";
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
    ? type === "defensive"
      ? "text-red-500"
      : "text-orange-500"
    : dailyTargetCompleted
    ? "text-green-500"
    : "text-blue-500";

  return (
    <>
      {overCapped && (
        <>
          {type === "offensive" ? (
            <Flame className={`mr-2 ${iconColor}`} size={iconSize} />
          ) : (
            <ShieldX className={`mr-2 ${iconColor}`} size={iconSize} />
          )}
        </>
      )}
      {!overCapped && !dailyTargetCompleted && (
        <>
          {type === "offensive" ? (
            <CircleAlert className={`mr-2 ${iconColor}`} size={iconSize} />
          ) : (
            <ShieldAlert className={`mr-2 ${iconColor}`} size={iconSize} />
          )}
        </>
      )}
      {!overCapped && dailyTargetCompleted && (
        <>
          {type === "offensive" ? (
            <CircleCheck className={`mr-2 ${iconColor}`} size={iconSize} />
          ) : (
            <ShieldCheck className={`mr-2 ${iconColor}`} size={iconSize} />
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
