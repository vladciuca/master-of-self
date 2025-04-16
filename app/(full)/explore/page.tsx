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
    <div className="py-4">
      <div className="scroll-m-20 text-3xl font-semibold tracking-tight w-full text-center pb-2">
        Explore Disciplines
      </div>
      {/* <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center">
        Explore Disciplines
      </h1> */}
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
