import { PracticeCard } from "@components/practices/PracticeCard";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

export function CreatePageCard({ onCreate }: { onCreate: () => void }) {
  return (
    <PracticeCard
      value="create-new-page"
      icon="GiSpellBook"
      discipline="1 / 1 available"
      title="Create a New Practice"
      color="primary"
      iconClassName="border-none p-0 -mt-2"
      iconSize={80}
      className="mt-2 mb-6"
      triggerClassName="bg-muted/30 rounded-lg pb-2 pt-4"
      action={
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-7 w-7 mr-2.5"
          aria-label="Create a new practice"
          onClick={(e) => {
            e.stopPropagation();
            onCreate();
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      }
      expandedContent={
        <div className="px-2 mt-2 text-sm text-muted-foreground space-y-2">
          <p>
            Create a custom practice with your own prompt by choosing a
            Discipline and choosing your daily rhythm.
          </p>
          <p>
            Leveling up unlocks the ability to create new custom practices.
          </p>
        </div>
      }
      showDescription={false}
    />
  );
}
