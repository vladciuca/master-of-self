"use client";

import { PracticeFeedCard } from "@components/practices/discipline-feed-card/PracticeFeedCard";
import { Accordion } from "@/components/ui/accordion";
import { useAllPractices } from "@hooks/practices/useAllPractices";
import { SkeletonPracticeCard } from "@components/skeletons/SkeletonPracticeCard";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonPracticeCard key={index} />
));

export function PracticeCommunity() {
  const { practices, loading, error } = useAllPractices();

  return (
    <>
      {loading ? (
        <div className="space-y-4">{skeletonCards}</div>
      ) : error ? (
        <div>
          <span>Error:</span>
          <div>
            {error ||
              "There was an error loading your practices. Please try again later."}
          </div>
        </div>
      ) : practices.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8 px-2 sm:px-8">
          No community practices available at the moment.
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {practices.map((practice) => (
            <PracticeFeedCard
              key={String(practice._id)}
              step={practice}
            />
          ))}
        </Accordion>
      )}
    </>
  );
}
