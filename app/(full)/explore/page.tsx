"use client";

import { DisciplineFeedCard } from "@components/disciplines/discipline-feed-card/DisciplineFeedCard";
import { Accordion } from "@/components/ui/accordion";

import { useAllDisciplines } from "@/hooks/disciplines/useAllDisciplines";

export default function ExplorePage() {
  const { disciplines, loading, error } = useAllDisciplines();

  if (loading) {
    return <div>Loading disciplines...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Explore Disciplines</h1>
      <Accordion type="single" collapsible className="mt-4">
        {disciplines.map((discipline) => (
          <DisciplineFeedCard step={discipline} handleEdit={() => {}} />
        ))}
      </Accordion>
    </div>
  );
}
