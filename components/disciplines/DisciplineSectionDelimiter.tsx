import { IconRenderer } from "@components/IconRenderer";
import { stepIconMap } from "@components/ui/constants";

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
  const dayIcon = (
    <IconRenderer
      iconName={stepIconMap.day}
      size={20}
      className="mr-1 text-muted"
    />
  );
  const nightIcon = (
    <IconRenderer
      iconName={stepIconMap.night}
      size={20}
      className="mr-1 text-muted"
    />
  );
  const IconElement = day ? dayIcon : nightIcon;

  return (
    <div className="flex items-center justify-between my-4 bg-muted/30 rounded-lg p-2 px-3">
      <div className="scroll-m-20 text-muted-foreground font-semibold tracking-tight flex items-center">
        <span className="mr-2">{IconElement}</span>
        {day ? "Morning" : "Evening"}
      </div>
      <div className="flex items-center space-x-2">
        <span className="scroll-m-20 text-lg font-semibold tracking-tight">
          {activeSteps}
          <span className="font-thin mx-1 text-muted-foreground">/</span>
          <span className="text-muted-foreground">{maxSteps}</span>
        </span>
      </div>
    </div>
  );
}
