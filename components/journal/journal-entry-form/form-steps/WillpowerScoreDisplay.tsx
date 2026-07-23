import { FaBoltLightning } from "react-icons/fa6";
import { getRuntimeColorProps } from "@lib/utils";

export type WillpowerScoreDisplayProps = {
  willpower: number | string;
  color: string;
};

export function WillpowerScoreDisplay({
  willpower,
  color,
}: WillpowerScoreDisplayProps) {
  const colorProps = getRuntimeColorProps(color, "text");
  return (
    <div className="flex items-center">
      <span
        className={`${colorProps.className ?? ""} text-bold text-5xl`}
        style={colorProps.style}
      >
        {willpower}
      </span>
      <FaBoltLightning className="ml-2 text-4xl" />
    </div>
  );
}
