"use client";

import { PillTabs } from "@components/ui/pill-tabs";

interface FilterButtonsProps {
  options: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function JournalEntryListFilters({
  options,
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="relative w-full mb-2">
      <PillTabs
        options={options}
        activeOption={activeFilter}
        onSelect={onFilterChange}
      />
    </div>
  );
}
