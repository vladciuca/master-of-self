import { Button } from "@components/ui/button";

type DisciplineFeedContentProps = {};

export function DisciplineFeedFooter({}: DisciplineFeedContentProps) {
  return (
    <div>
      <div className="w-full flex justify-between mt-4 px-2">
        <Button variant="outline" size="sm" className="w-full">
          Learn Discipline
        </Button>
      </div>
    </div>
  );
}
