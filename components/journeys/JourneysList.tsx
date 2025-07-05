import { Accordion } from "@/components/ui/accordion";
import { JourneyCard } from "@components/journeys/journey-card/JourneyCard";
import { NewJourneyCard } from "@components/journeys/NewJourneyCard";
import { Journey } from "@models/mongodb";

type JourneysListProps = {
  journeyList: Journey[];
  handleEdit: (journey: Journey) => void;
  handleView: (journey: Journey) => void;
  onboarding?: boolean;
};

export function JourneysList({
  journeyList,
  handleEdit,
  handleView,
  onboarding = false,
}: JourneysListProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className={onboarding ? "mt-8 sm:mt-16" : ""}
    >
      <NewJourneyCard onboarding={onboarding} />

      {journeyList.length === 0 ? (
        <div className="text-center text-muted-foreground p-4 pt-8">
          You don't have any journeys yet. Start by creating one!
        </div>
      ) : (
        <>
          {journeyList.map((journey) => (
            <JourneyCard
              key={String(journey._id)}
              journey={journey}
              handleEdit={handleEdit}
              handleView={handleView}
            />
          ))}
        </>
      )}
    </Accordion>
  );
}
