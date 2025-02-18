"use client";

import { JournalEntryList } from "@components/journal/JournalEntryList";
import { SkeletonJournalEntryCard } from "@components/skeletons/SkeletonJournalEntryCard";
import { useUserJournal } from "@hooks/useUserJournal";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonJournalEntryCard key={index} />
));

export function UserJournal() {
  const { journalEntries, journalEntriesLoading, journalEntriesError } =
    useUserJournal();

  // const handleDelete = async (journalEntry: JournalEntryMetadata) => {
  //   const hasConfirmed = confirm("Are you sure you want to delete this habit?");

  //   if (hasConfirmed) {
  //     try {
  //       await fetch(`/api/journal-entry/${journalEntry._id.toString()}`, {
  //         method: "DELETE",
  //       });

  //       const filteredJournalEntries = journalEntries.filter(
  //         (myJournalEntry: JournalEntryMetadata) =>
  //           myJournalEntry._id !== journalEntry._id
  //       );

  //       setJournalEntries(filteredJournalEntries);

  //       router.push("/journal");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  return (
    <div className="pt-0">
      {journalEntriesLoading && <>{skeletonCards}</>}
      {!journalEntriesLoading && !journalEntriesError && (
        <div>
          <JournalEntryList
            journalEntries={journalEntries}
            // handleDelete={handleDelete}
          />
        </div>
      )}
      {journalEntriesError && <p>Error: {journalEntriesError}</p>}
    </div>
  );
}
