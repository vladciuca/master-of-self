interface XpDisplayProps {
  xpValue: number;
}

export const XpDisplay = ({ xpValue }: XpDisplayProps) => {
  if (xpValue > 0) {
    return <span className="text-xp-positive">+{xpValue}</span>;
  } else if (xpValue < 0) {
    return <span className="text-xp-negative">{xpValue}</span>;
  } else {
    return <span>{xpValue}</span>;
  }
};
