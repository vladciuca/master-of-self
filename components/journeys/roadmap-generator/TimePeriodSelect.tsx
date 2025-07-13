import { CheckCircle } from "lucide-react";

export interface TimePeriod {
  value: string;
  label: string;
  fullLabel: string;
  description: string;
}

const DEFAULT_TIME_PERIODS: TimePeriod[] = [
  {
    value: "1m",
    label: "1 Month",
    fullLabel: "1 month",
    description: "Perfect for quick skills",
  },
  {
    value: "3m",
    label: "3 Months",
    fullLabel: "3 months",
    description: "Perfect for focused learning",
  },
  {
    value: "6m",
    label: "6 Months",
    fullLabel: "6 months",
    description: "Perfect for comprehensive growth",
  },
  {
    value: "12m",
    label: "1 Year",
    fullLabel: "12 months",
    description: "Perfect for mastery & expertise",
  },
];

type TimePeriodSelectProps = {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  timePeriods?: TimePeriod[];
};

export function TimePeriodSelect({
  selectedPeriod,
  setSelectedPeriod,
  timePeriods = DEFAULT_TIME_PERIODS,
}: TimePeriodSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-primary">
        Select your journey timeframe:
      </label>
      <div className="grid grid-cols-1 gap-2">
        {timePeriods.map((period) => (
          <label
            key={period.value}
            className={`
          relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${
            selectedPeriod === period.value
              ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
              : "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
          }
        `}
          >
            <input
              type="radio"
              name="timePeriod"
              value={period.value}
              checked={selectedPeriod === period.value}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="sr-only"
            />
            <div
              className={`
          w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-colors
          ${
            selectedPeriod === period.value
              ? "border-primary bg-primary"
              : "border-muted-foreground"
          }
        `}
            >
              {selectedPeriod === period.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{period.label}</div>
              <div className="text-sm text-muted-foreground">
                {period.description}
              </div>
            </div>
            {selectedPeriod === period.value && (
              <div className="text-primary">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
