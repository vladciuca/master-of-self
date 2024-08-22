import JournalEntryCard from "@components/JournalEntryCard";
import NewJournalEntry from "@components/NewJournalEntry";
import { Accordion } from "@components/ui/accordion";

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
  dayEntry?: {
    myDay: string;
  };
  nightEntry?: {
    myNight: string;
  };
  creator?: {
    _id: string;
  };
};

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
      <Accordion type="single" className="pb-1">
        {journalEntries.map((journalEntry) => {
          return (
            <JournalEntryCard
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
