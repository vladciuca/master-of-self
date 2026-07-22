import { IconRenderer } from "@components/IconRenderer";
import { Button } from "@components/ui/button";
import { JOURNAL_COLORS } from "@lib/colors";
import { ArrowUpDown } from "lucide-react";

export function SectionHeader({
  title,
  active,
  total,
  icon,
  reordering,
  onToggleReorder,
}: {
  title: string;
  active: number;
  total: number;
  icon?: string;
  reordering?: boolean;
  onToggleReorder?: () => void;
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
      <div
        className={`font-semibold tracking-tight flex items-center gap-2 ${textColor}`}
      >
        {icon && (
          <IconRenderer iconName={icon} size={20} className={iconColor} />
        )}
        {title}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold tracking-tight flex items-center">
          {active}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{total}</span>
        </span>
        {onToggleReorder && (
          <Button
            type="button"
            variant={reordering ? "default" : "outline"}
            size="icon"
            className="rounded-full h-7 w-7"
            onClick={onToggleReorder}
            aria-label={
              reordering ? "Done rearranging" : "Rearrange practices"
            }
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
