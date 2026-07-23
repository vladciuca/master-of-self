import { Switch } from "@components/ui/switch";
import { cn } from "@lib/utils";

type PracticeSwitchProps = {
  type: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
};

// Custom styled switch component
export function PracticeSwitch({
  type,
  checked,
  onCheckedChange,
  disabled,
}: PracticeSwitchProps) {
  // Dynamic styles based on type
  const trackColorClass =
    type === "dayEntry"
      ? "bg-journal-day"
      : "bg-journal-night";

  const handleSwitchClick = (e: React.MouseEvent) => {
    // Stop the event from bubbling up to the AccordionTrigger
    e.stopPropagation();
  };

  return (
    <div className="relative inline-flex" onClick={handleSwitchClick}>
      {/* Custom overlay for the track */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-colors pointer-events-none",
          checked ? trackColorClass : "bg-muted"
        )}
      />

      {/* The switch component */}
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(checked ? trackColorClass : "bg-muted")}
      />

      {/* Icon overlay for the thumb */}
      <div className="absolute pointer-events-none top-0.5 left-0.5 flex h-5 w-5 items-center justify-center">
        <div
          className={cn(
            "absolute flex items-center justify-center h-5 w-5 rounded-full transition-transform bg-primary",
            checked && "translate-x-5"
          )}
        />
      </div>
    </div>
  );
}
