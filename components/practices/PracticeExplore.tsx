"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@components/ui/accordion";
import { PracticeFeedCard } from "@components/practices/discipline-feed-card/PracticeFeedCard";
import { FilterPill } from "@components/practices/practice-explore/FilterPill";
import { SkeletonPracticeCard } from "@components/skeletons/SkeletonPracticeCard";
import { useAllPractices } from "@hooks/practices/useAllPractices";
import { DISCIPLINES, BASE_DISCIPLINE_ID } from "@lib/disciplines";
import { JOURNAL_HEX_COLORS } from "@lib/colors";
import { isHexColor } from "@lib/utils";
import type { Practice } from "@models/mongodb";
import type { JournalCustomStepConfig } from "@models/types";

type ExploreItem = JournalCustomStepConfig | Practice;
type TimeFilter = "dayEntry" | "nightEntry";
type SourceFilter = "curated" | "community";

const curatedPractices = DISCIPLINES.filter(
  (config) => String(config._id) !== BASE_DISCIPLINE_ID
);

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonPracticeCard key={index} />
));

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function PracticeExplore() {
  const { practices, loading, error } = useAllPractices();

  const [timeFilters, setTimeFilters] = useState<TimeFilter[]>([]);
  const [sourceFilters, setSourceFilters] = useState<SourceFilter[]>([]);
  const [disciplineFilters, setDisciplineFilters] = useState<string[]>([]);

  const allPractices = useMemo<ExploreItem[]>(
    () => [...curatedPractices, ...practices],
    [practices]
  );

  const disciplineOptions = useMemo(() => {
    const options = new Map<string, string | undefined>();
    for (const config of curatedPractices) {
      options.set(
        config.discipline,
        isHexColor(config.color) ? config.color : undefined
      );
    }
    for (const practice of practices) {
      if (!options.has(practice.discipline)) {
        options.set(
          practice.discipline,
          isHexColor(practice.color) ? practice.color : undefined
        );
      }
    }
    return [...options.entries()];
  }, [practices]);

  const filteredPractices = allPractices.filter((item) => {
    if (
      timeFilters.length > 0 &&
      !timeFilters.includes(item.type as TimeFilter)
    ) {
      return false;
    }
    if (sourceFilters.length > 0) {
      const source: SourceFilter = item.creatorId ? "community" : "curated";
      if (!sourceFilters.includes(source)) return false;
    }
    if (
      disciplineFilters.length > 0 &&
      !disciplineFilters.includes(item.discipline)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 py-2">
        <FilterPill
          label="Morning"
          selected={timeFilters.includes("dayEntry")}
          onToggle={() =>
            setTimeFilters((prev) => toggleValue(prev, "dayEntry"))
          }
          colorHex={JOURNAL_HEX_COLORS.dayHex}
        />
        <FilterPill
          label="Evening"
          selected={timeFilters.includes("nightEntry")}
          onToggle={() =>
            setTimeFilters((prev) => toggleValue(prev, "nightEntry"))
          }
          colorHex={JOURNAL_HEX_COLORS.nightHex}
        />
        <span className="h-4 w-px bg-border mx-1" />
        <FilterPill
          label="Curated"
          selected={sourceFilters.includes("curated")}
          onToggle={() =>
            setSourceFilters((prev) => toggleValue(prev, "curated"))
          }
        />
        <FilterPill
          label="Community"
          selected={sourceFilters.includes("community")}
          onToggle={() =>
            setSourceFilters((prev) => toggleValue(prev, "community"))
          }
        />
      </div>

      <div className="flex gap-2 overflow-x-auto py-2 mb-4">
        {disciplineOptions.map(([name, colorHex]) => (
          <FilterPill
            key={name}
            label={name}
            selected={disciplineFilters.includes(name)}
            onToggle={() =>
              setDisciplineFilters((prev) => toggleValue(prev, name))
            }
            colorHex={colorHex}
          />
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 mt-2">{skeletonCards}</div>
      ) : error ? (
        <div>
          <span>Error:</span>
          <div>
            {error ||
              "There was an error loading your practices. Please try again later."}
          </div>
        </div>
      ) : filteredPractices.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8 px-2 sm:px-8">
          No practices match your filters.
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4 mt-2">
          {filteredPractices.map((item) => (
            <PracticeFeedCard key={String(item._id)} step={item} />
          ))}
        </Accordion>
      )}
    </div>
  );
}
