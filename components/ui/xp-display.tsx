import { XP_COLORS } from "@lib/colors";
interface XpDisplayProps {
  xpValue: number;
}

export const XpDisplay = ({ xpValue }: XpDisplayProps) => {
  if (xpValue > 0) {
    return <span className={`text-${XP_COLORS.positive}`}>+{xpValue}</span>;
  } else if (xpValue < 0) {
    return <span className={`text-${XP_COLORS.negative}`}>{xpValue}</span>;
  } else {
    return <span>{xpValue}</span>;
  }
};
