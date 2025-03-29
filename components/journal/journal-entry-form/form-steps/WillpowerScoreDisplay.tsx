import { FaBoltLightning } from "react-icons/fa6";

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
      <span className={`text-${color} text-bold text-5xl`}>{willpower}</span>
      <FaBoltLightning className="ml-2 text-4xl" />
    </div>
  );
}
