// "use client";

// import { useState, useMemo } from "react";
// import { NewJournalEntry } from "@components/journal/NewJournalEntry";
// import { JournalEntryCard } from "@components/journal/journal-entry-card/JournalEntryCard";
// import { Accordion } from "@components/ui/accordion";
// import { JournalEntryListFilters } from "@components/journal/JournalEntryListFilters";
// import {
//   isEvening,
//   isThisWeek,
//   isThisMonth,
//   isCurrentMonthYear,
//   isSpecificMonthYear,
// } from "@lib/time";
// import type { JournalEntryMetadata } from "@models/types";
// import { useUserSettings } from "@hooks/useUserSettings";

// type JournalEntryListProps = {
//   journalEntries: JournalEntryMetadata[];
//   // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
// };

// type FilterOption = "This Week" | "This Month" | string;

// export function JournalEntryList({
//   journalEntries,
// }: // handleDelete,
// JournalEntryListProps) {
//   const { userSettings, userSettingsLoading } = useUserSettings();
//   const [filter, setFilter] = useState<FilterOption>("This Week");
//   const isEveningTime = isEvening(userSettings.journalStartTime.evening);

//   const filterOptions = useMemo(() => {
//     const options: FilterOption[] = ["This Week", "This Month"];
//     const monthSet = new Set<string>();

//     journalEntries.forEach((entry) => {
//       const entryDate = new Date(entry.createDate);
//       const monthYear = entryDate.toLocaleString("default", {
//         month: "long",
//         year: "numeric",
//       });
//       if (!isCurrentMonthYear(entryDate)) {
//         monthSet.add(monthYear);
//       }
//     });

//     return [...options, ...Array.from(monthSet)];
//   }, [journalEntries]);

//   const filteredEntries = useMemo(() => {
//     return journalEntries.filter((entry) => {
//       const entryDate = new Date(entry.createDate);
//       switch (filter) {
//         case "This Week":
//           return isThisWeek(entryDate);
//         case "This Month":
//           return isThisMonth(entryDate);
//         default:
//           return isSpecificMonthYear(entryDate, filter);
//       }
//     });
//   }, [journalEntries, filter]);

//   const hasTodayEntry = journalEntries.some((entry) => {
//     const entryDate = new Date(entry.createDate);
//     const currentDate = new Date();
//     return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
//   });

//   return (
//     <>
//       <div className="sticky top-0 z-10 bg-background pt-4 pb-2 shadow-sm">
//         {!hasTodayEntry && <NewJournalEntry isEveningTime={isEveningTime} />}
//         <JournalEntryListFilters
//           options={filterOptions}
//           activeFilter={filter}
//           onFilterChange={setFilter}
//         />
//       </div>
//       <Accordion type="single" collapsible className="pb-1">
//         {filteredEntries.map((journalEntry, index) => (
//           <JournalEntryCard
//             key={index}
//             journalEntry={journalEntry}
//             isEveningTime={isEveningTime}
//             // handleDelete={handleDelete}
//           />
//         ))}
//       </Accordion>
//     </>
//   );
// }
// "use client";

// import { useState, useMemo } from "react";
// import { NewJournalEntry } from "@components/journal/NewJournalEntry";
// import { JournalEntryCard } from "@components/journal/journal-entry-card/JournalEntryCard";
// import { Accordion } from "@components/ui/accordion";
// import { JournalEntryListFilters } from "@components/journal/JournalEntryListFilters";
// import {
//   isEvening,
//   isThisWeek,
//   isThisMonth,
//   isCurrentMonthYear,
//   isSpecificMonthYear,
// } from "@lib/time";
// import type { JournalEntryMetadata } from "@models/types";
// import { useUserSettings } from "@hooks/useUserSettings";

// type JournalEntryListProps = {
//   journalEntries: JournalEntryMetadata[];
// };

// type FilterOption = "This Week" | "This Month" | string;

// export function JournalEntryList({ journalEntries }: JournalEntryListProps) {
//   const { userSettings, userSettingsLoading } = useUserSettings();
//   const [filter, setFilter] = useState<FilterOption>("This Week");
//   const isEveningTime = isEvening(userSettings.journalStartTime.evening);

//   // CHANGE: Modify filterOptions logic
//   const filterOptions = useMemo(() => {
//     const options: FilterOption[] = [];
//     const monthSet = new Set<string>();

//     let hasEntriesThisMonth = false;

//     journalEntries.forEach((entry) => {
//       const entryDate = new Date(entry.createDate);
//       if (isThisMonth(entryDate)) {
//         hasEntriesThisMonth = true;
//       }
//       const monthYear = entryDate.toLocaleString("default", {
//         month: "long",
//         year: "numeric",
//       });
//       if (!isCurrentMonthYear(entryDate)) {
//         monthSet.add(monthYear);
//       }
//     });

//     // Always show "This Week"
//     options.push("This Week");

//     // Show "This Month" only if there are entries in the current month
//     if (hasEntriesThisMonth) {
//       options.push("This Month");
//     }

//     return [...options, ...Array.from(monthSet)];
//   }, [journalEntries]);

//   // CHANGE: Update filteredEntries logic
//   const filteredEntries = useMemo(() => {
//     return journalEntries.filter((entry) => {
//       const entryDate = new Date(entry.createDate);
//       switch (filter) {
//         case "This Week":
//           return isThisWeek(entryDate);
//         case "This Month":
//           return isThisMonth(entryDate);
//         default:
//           return isSpecificMonthYear(entryDate, filter);
//       }
//     });
//   }, [journalEntries, filter]);

//   const hasTodayEntry = journalEntries.some((entry) => {
//     const entryDate = new Date(entry.createDate);
//     const currentDate = new Date();
//     return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
//   });

//   // CHANGE: Add a function to get the empty state message
//   const getEmptyStateMessage = (filter: FilterOption) => {
//     switch (filter) {
//       case "This Week":
//         return "No journal entries for the current week.";
//       case "This Month":
//         return "No journal entries for the current month.";
//       default:
//         return `No journal entries for ${filter}.`;
//     }
//   };

//   return (
//     <>
//       <div className="sticky top-0 z-10 bg-background pt-4 pb-2 shadow-sm">
//         {!hasTodayEntry && <NewJournalEntry isEveningTime={isEveningTime} />}
//         <JournalEntryListFilters
//           options={filterOptions}
//           activeFilter={filter}
//           onFilterChange={setFilter}
//         />
//       </div>
//       {filteredEntries.length > 0 ? (
//         <Accordion type="single" collapsible className="pb-1">
//           {filteredEntries.map((journalEntry, index) => (
//             <JournalEntryCard
//               key={index}
//               journalEntry={journalEntry}
//               isEveningTime={isEveningTime}
//             />
//           ))}
//         </Accordion>
//       ) : (
//         // CHANGE: Add empty state message
//         <p className="text-center text-muted-foreground py-4">
//           {getEmptyStateMessage(filter)}
//         </p>
//       )}
//     </>
//   );
// }
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
};

type FilterOption = "This Week" | "This Month" | string;

export function JournalEntryList({ journalEntries }: JournalEntryListProps) {
  const { userSettings, userSettingsLoading } = useUserSettings();
  const [filter, setFilter] = useState<FilterOption>("This Week");
  const isEveningTime = isEvening(userSettings.journalStartTime.evening);
  const listRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const hasTodayEntry = journalEntries.some((entry) => {
    const entryDate = new Date(entry.createDate);
    const currentDate = new Date();
    return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  });

  useEffect(() => {
    if (headerRef.current) {
      const updateHeaderHeight = () =>
        setHeaderHeight(headerRef.current!.offsetHeight);

      updateHeaderHeight(); // Set initial height
      window.addEventListener("resize", updateHeaderHeight); // Update on resize

      return () => window.removeEventListener("resize", updateHeaderHeight);
    }
  }, [hasTodayEntry]);

  const filterOptions = useMemo(() => {
    const options: FilterOption[] = [];
    const monthSet = new Set<string>();

    let hasEntriesThisMonth = false;

    journalEntries.forEach((entry) => {
      const entryDate = new Date(entry.createDate);
      if (isThisMonth(entryDate)) {
        hasEntriesThisMonth = true;
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

    if (hasEntriesThisMonth) {
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
      case "This Month":
        return "No journal entries for the current month.";
      default:
        return `No journal entries for ${filter}.`;
    }
  };

  const handleFilterChange = useCallback(
    (newFilter: FilterOption) => {
      setFilter(newFilter);
      if (listRef.current) {
        listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [headerHeight]
  );

  console.log("===headerHeight", headerHeight);

  return (
    <>
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
      {/* <div ref={listRef} className={`scroll-mt-[${headerHeight}px]`}> */}
      <div ref={listRef} style={{ scrollMarginTop: `${headerHeight}px` }}>
        {filteredEntries.length > 0 ? (
          <Accordion type="single" collapsible className="pb-1">
            {filteredEntries.map((journalEntry, index) => (
              <JournalEntryCard
                key={index}
                journalEntry={journalEntry}
                isEveningTime={isEveningTime}
              />
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            {getEmptyStateMessage(filter)}
          </p>
        )}
      </div>
    </>
  );
}
