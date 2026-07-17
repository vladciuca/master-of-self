import { FaBoltLightning } from "react-icons/fa6";
import { isHexColor } from "@lib/utils";

export type WillpowerScoreDisplayProps = {
  willpower: number | string;
  color: string;
};

export function WillpowerScoreDisplay({
  willpower,
  color,
}: WillpowerScoreDisplayProps) {
  return (
    <div className="flex items-center">
      <span
        className={`${
          isHexColor(color) ? "" : `text-${color}`
        } text-bold text-5xl`}
        style={isHexColor(color) ? { color } : undefined}
      >
        {willpower}
      </span>
      <FaBoltLightning className="ml-2 text-4xl" />
    </div>
  );
}
