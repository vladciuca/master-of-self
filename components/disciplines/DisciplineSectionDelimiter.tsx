import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";
import { JOURNAL_COLORS } from "@lib/colors";

type DisciplineSectionDelimiterProps = {
  day: boolean;
  activeSteps: number;
  maxSteps: number;
};

export function DisciplineSectionDelimiter({
  day,
  activeSteps,
  maxSteps,
}: DisciplineSectionDelimiterProps) {
  const iconColor = "muted";
  const dayIcon = (
    <IconRenderer
      iconName={stepIconMap.day}
      size={20}
      className={`mr-1 text-${JOURNAL_COLORS.day}`}
    />
  );
  const nightIcon = (
    <IconRenderer
      iconName={stepIconMap.night}
      size={20}
      className={`mr-1 text-${JOURNAL_COLORS.night}`}
    />
  );
  const IconElement = day ? dayIcon : nightIcon;

  return (
    <div className="flex items-center justify-between my-4 bg-muted/30 rounded-full p-2 px-3">
      <div className="scroll-m-20 text-muted-foreground font-semibold tracking-tight flex items-center ml-2">
        {day ? "Morning" : "Evening"}
      </div>
      <div className="flex items-center space-x-2">
        <span className="scroll-m-20 text-xl font-semibold tracking-tight flex items-center">
          {activeSteps}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{maxSteps}</span>
          <span className="ml-2">{IconElement}</span>
        </span>
      </div>
    </div>
  );
}
