"use client";

import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { useAllDisciplines } from "@hooks/disciplines/useAllDisciplines";
import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonDisciplineCard key={index} />
));

export function Community() {
  const { disciplines, loading, error } = useAllDisciplines();

  return (
    <>
      {loading ? (
        <div className="space-y-4">{skeletonCards}</div>
      ) : error ? (
        <div>
          <span>Error:</span>
          <div>
            {error ||
              "There was an error loading your disciplines. Please try again later."}
          </div>
        </div>
      ) : disciplines.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8 px-2 sm:px-8">
          No community disciplines available at the moment.
        </div>
      ) : (
        <Accordion type="single" collapsible>
          {disciplines.map((discipline) => (
            <DisciplineFeedCard
              key={String(discipline._id)}
              step={discipline}
            />
          ))}
        </Accordion>
      )}
    </>
  );
}
