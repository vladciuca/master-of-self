import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { NewJournalEntry } from "@components/journal/NewJournalEntry";
import { JournalEntryCard } from "@components/journal/journal-entry-card/JournalEntryCard";
import { JournalEntryListFilters } from "@components/journal/JournalEntryListFilters";
import {
  isEvening,
  isThisWeek,
  isThisMonth,
  isCurrentMonthYear,
  isSpecificMonthYear,
} from "@lib/time";
import type { JournalEntryMetadata } from "@models/types";
import { useUserProfile } from "@context/UserProfileContext";

type JournalEntryListProps = {
  journalEntries: JournalEntryMetadata[];
};

type FilterOption = "This Week" | "This Month" | string;

export function JournalEntryList({ journalEntries }: JournalEntryListProps) {
  const { userProfile, userProfileLoading } = useUserProfile();
  const [filter, setFilter] = useState<FilterOption>("This Week");
  const isEveningTime = isEvening(userProfile?.journalStartTime.evening);
  const listRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Add a timeout ref to handle delayed scrolling
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const hasTodayEntry = journalEntries.some((entry) => {
    const entryDate = new Date(entry.createDate);
    const currentDate = new Date();
    return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  });

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    // Update header height after layout effects
    const rafId = requestAnimationFrame(() => {
      updateHeaderHeight();
    });

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  // Add effect to handle scrolling when filter changes
  useEffect(() => {
    if (listRef.current) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout to scroll after the filter change has been processed
      scrollTimeoutRef.current = setTimeout(() => {
        listRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [filter]);

  const filterOptions = useMemo(() => {
    const options: FilterOption[] = [];
    const monthSet = new Set<string>();

    // let hasEntriesThisMonth = false;
    // CHANGE HERE: Check if there are entries in this month but outside this week
    // This will determine if we should show the "This Month" filter option
    let hasEntriesThisMonthButNotThisWeek = false;

    journalEntries.forEach((entry) => {
      const entryDate = new Date(entry.createDate);
      // if (isThisMonth(entryDate)) {
      //   hasEntriesThisMonth = true;
      // }
      // Check if entry is in this month but NOT in this week
      if (isThisMonth(entryDate) && !isThisWeek(entryDate)) {
        hasEntriesThisMonthButNotThisWeek = true;
      }
      const monthYear = entryDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!isCurrentMonthYear(entryDate)) {
        monthSet.add(monthYear);
      }
    });

    options.push("This Week");

    // should not be displayed if current week has not passed yet
    // if (hasEntriesThisMonth) {
    //   options.push("This Month");
    // }
    // UPDATED CONDITION: Only add "This Month" if there are entries this month that are not in this week
    if (hasEntriesThisMonthButNotThisWeek) {
      options.push("This Month");
    }

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

  const getEmptyStateMessage = (filter: FilterOption) => {
    switch (filter) {
      case "This Week":
        return "No journal entries for the current week.";
      // this month should not even appear if there is no "This week"
      // think of any edge-cases that might trigger this
      case "This Month":
        return "No journal entries for the current month.";
      default:
        return `No journal entries for ${filter}.`;
    }
  };

  const handleFilterChange = useCallback((newFilter: FilterOption) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="relative">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 bg-background pt-4 pb-2 shadow-sm"
      >
        {!hasTodayEntry && <NewJournalEntry isEveningTime={isEveningTime} />}
        <JournalEntryListFilters
          options={filterOptions}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div
        ref={listRef}
        style={{ scrollMarginTop: `${headerHeight}px` }}
        className="relative"
      >
        {filteredEntries.length > 0 ? (
          <div className="pb-1">
            {filteredEntries.map((journalEntry, index) => (
              <JournalEntryCard
                key={journalEntry._id}
                journalEntry={journalEntry}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            {getEmptyStateMessage(filter)}
          </p>
        )}
      </div>
    </div>
  );
}
