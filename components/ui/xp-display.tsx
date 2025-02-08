interface XpDisplayProps {
  xpValue: number;
}

export const XpDisplay = ({ xpValue }: XpDisplayProps) => {
  if (xpValue > 0) {
    return <span className="text-green-500">+{xpValue}</span>;
  } else if (xpValue < 0) {
    return <span className="text-red-500">{xpValue}</span>;
  } else {
    return <span>{xpValue}</span>;
  }
};
