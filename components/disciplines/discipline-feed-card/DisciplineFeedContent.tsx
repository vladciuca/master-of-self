import { DisciplineCreator } from "@components/disciplines/discipline-card/DisciplineCreator";
import { Button } from "@components/ui/button";

type DisciplineFeedContentProps = {
  description: string;
};

export function DisciplineFeedContent({
  description,
}: DisciplineFeedContentProps) {
  return (
    <div>
      <div className="text-muted-foreground px-3">{description}</div>
      <div className="w-full flex justify-between mt-10">
        <Button variant="secondary" size="sm" className="ml-3 px-6">
          Learn
        </Button>
        <DisciplineCreator />
      </div>
    </div>
  );
}
