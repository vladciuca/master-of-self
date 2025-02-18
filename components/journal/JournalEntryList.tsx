"use client";

import { useState, useMemo } from "react";
import { NewJournalEntry } from "@components/journal/NewJournalEntry";
import { JournalEntryCard } from "@components/journal/journal-entry-card/JournalEntryCard";
import { Accordion } from "@components/ui/accordion";
import { JournalEntryListFilters } from "@components/journal/JournalEntryListFilters";
import {
  isEvening,
  isThisWeek,
  isThisMonth,
  isCurrentMonthYear,
  isSpecificMonthYear,
} from "@lib/time";
import type { JournalEntryMetadata } from "@models/types";
import { useUserSettings } from "@hooks/useUserSettings";

type JournalEntryListProps = {
  journalEntries: JournalEntryMetadata[];
  // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

type FilterOption = "This Week" | "This Month" | string;

export function JournalEntryList({
  journalEntries,
}: // handleDelete,
JournalEntryListProps) {
  const { userSettings, userSettingsLoading } = useUserSettings();
  const [filter, setFilter] = useState<FilterOption>("This Week");
  const isEveningTime = isEvening(userSettings.journalStartTime.evening);

  const filterOptions = useMemo(() => {
    const options: FilterOption[] = ["This Week", "This Month"];
    const monthSet = new Set<string>();

    journalEntries.forEach((entry) => {
      const entryDate = new Date(entry.createDate);
      const monthYear = entryDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!isCurrentMonthYear(entryDate)) {
        monthSet.add(monthYear);
      }
    });

    return [...options, ...Array.from(monthSet)];
  }, [journalEntries]);

  const filteredEntries = useMemo(() => {
    return journalEntries.filter((entry) => {
      const entryDate = new Date(entry.createDate);
      switch (filter) {
        case "This Week":
          return isThisWeek(entryDate);
        case "This Month":
          return isThisMonth(entryDate);
        default:
          return isSpecificMonthYear(entryDate, filter);
      }
    });
  }, [journalEntries, filter]);

  const hasTodayEntry = journalEntries.some((entry) => {
    const entryDate = new Date(entry.createDate);
    const currentDate = new Date();
    return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  });

  return (
    <>
      {!hasTodayEntry && <NewJournalEntry isEveningTime={isEveningTime} />}
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 shadow-sm">
        <JournalEntryListFilters
          options={filterOptions}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
      <Accordion type="single" collapsible className="pb-1">
        {filteredEntries.map((journalEntry, index) => (
          <JournalEntryCard
            key={index}
            journalEntry={journalEntry}
            isEveningTime={isEveningTime}
            // handleDelete={handleDelete}
          />
        ))}
      </Accordion>
    </>
  );
}
