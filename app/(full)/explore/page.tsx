"use client";

import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { useAllDisciplines } from "@/hooks/disciplines/useAllDisciplines";
import { SkeletonDisciplineCard } from "@components/skeletons/SkeletonDisciplineCard";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonDisciplineCard key={index} />
));

export default function ExplorePage() {
  const { disciplines, loading, error } = useAllDisciplines();

  return (
    <div className="my-4">
      <div className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Explore Disciplines
      </div>
      {loading ? (
        <div className="mt-4 space-y-4">{skeletonCards}</div>
      ) : !loading && error ? (
        <div>
          <span>Error:</span>
          <div>
            {error ||
              "There was an error loading your disciplines. Please try again later."}
          </div>
        </div>
      ) : (
        <>
          <Accordion type="single" collapsible className="mt-4">
            {disciplines.map((discipline) => (
              <DisciplineFeedCard step={discipline} />
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
}
