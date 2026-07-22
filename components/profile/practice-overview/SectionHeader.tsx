import { IconRenderer } from "@components/IconRenderer";
import { JOURNAL_COLORS } from "@lib/colors";

export function SectionHeader({
  title,
  active,
  total,
  icon,
}: {
  title: string;
  active: number;
  total: number;
  icon?: string;
}) {
  const isMorning = title === "Morning";
  const iconColor =
    active === 0
      ? "text-muted-foreground"
      : isMorning
        ? `text-${JOURNAL_COLORS.day}`
        : `text-${JOURNAL_COLORS.night}`;
  const textColor = active === 0 ? "text-muted-foreground" : "text-primary";

  return (
    <div className="flex items-center justify-between mt-4 mb-6 bg-muted/30 rounded-lg p-2 px-3">
      <div className={`font-semibold tracking-tight ${textColor}`}>
        {title}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold tracking-tight flex items-center">
          {active}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{total}</span>
          <span className="ml-2">
            {icon && (
              <IconRenderer iconName={icon} size={20} className={iconColor} />
            )}
          </span>
        </span>
      </div>
    </div>
  );
}
