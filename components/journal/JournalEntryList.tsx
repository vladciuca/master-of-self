import { NewJournalEntry } from "@components/journal/NewJournalEntry";
import { JournalEntryCard } from "@components/journal/JournalEntryCard";
import { Accordion } from "@components/ui/accordion";
import { JournalEntryMetadata } from "@app/types/types";

type JournalEntryListProps = {
  journalEntries: JournalEntryMetadata[];
  // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

export function JournalEntryList({
  journalEntries,
}: // handleDelete,
JournalEntryListProps) {
  const hasTodayEntry = journalEntries.some((entry) => {
    const entryDate = new Date(entry.createDate);
    const currentDate = new Date();
    return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  });

  return (
    <>
      {!hasTodayEntry && <NewJournalEntry />}
      <Accordion type="single" collapsible className="pb-1">
        {journalEntries.map((journalEntry, index) => {
          return (
            <JournalEntryCard
              key={index}
              journalEntry={journalEntry}
              // handleDelete={handleDelete}
            />
          );
        })}
      </Accordion>
    </>
  );
}
