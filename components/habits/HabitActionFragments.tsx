import {
  CircleAlert,
  OctagonAlert,
  BadgeAlert,
  ShieldAlert,
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
        <OctagonAlert className="mr-2 text-blue-500" size={iconSize} />
      )}
    </>
  );
}
