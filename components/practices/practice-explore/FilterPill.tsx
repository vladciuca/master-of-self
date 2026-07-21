type FilterPillProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  colorHex?: string;
};

function getContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
}

export function FilterPill({
  label,
  selected,
  onToggle,
  colorHex,
}: FilterPillProps) {
  const baseClasses =
    "px-3 py-1 text-xs rounded-full border capitalize flex-shrink-0 transition-colors";

  if (colorHex) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={baseClasses}
        style={{
          borderColor: colorHex,
          backgroundColor: selected ? colorHex : "transparent",
          color: selected ? getContrastText(colorHex) : colorHex,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${baseClasses} ${
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "border-primary text-primary bg-transparent"
      }`}
    >
      {label}
    </button>
  );
}
