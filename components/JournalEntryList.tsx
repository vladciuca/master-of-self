import JournalEntryCard from "@components/JournalEntryCard";
import NewJournalEntry from "@components/NewJournalEntry";
import { Accordion } from "@components/ui/accordion";
import { JournalEntry } from "@components/journal-entry-form/FormStepController";

export interface JournalEntryProps extends JournalEntry {
  _id: string;
  createDate: Date;
  creator?: {
    _id: string;
  };
}

type JournalEntryListProps = {
  journalEntries: JournalEntryProps[];
  handleDelete: (journalEntry: JournalEntryProps) => Promise<void>;
};

const JournalEntryList = ({
  journalEntries,
  handleDelete,
}: JournalEntryListProps) => {
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
              handleDelete={handleDelete}
            />
          );
        })}
      </Accordion>
    </>
  );
};

export default JournalEntryList;
