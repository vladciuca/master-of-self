import { PracticeCard } from "@components/practices/PracticeCard";
import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";

export function CreatePageCard({ onCreate }: { onCreate: () => void }) {
  return (
    <PracticeCard
      value="create-new-page"
      icon="GiSpellBook"
      title="Create a New Practice"
      color="primary"
      hideIconBorder
      iconSize={80}
      className="mt-2 mb-6"
      triggerClassName="bg-muted/30 rounded-lg pb-2"
      action={
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-8 w-8 mr-2 mt-2"
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
        <div className="px-2 mt-2 text-sm text-muted-foreground">
          <p>
            Build a custom practice with your own prompt, discipline, and daily
            or nightly rhythm.
          </p>
        </div>
      }
      showDescription={false}
    />
  );
}
