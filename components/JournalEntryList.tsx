import JournalEntryCard from "@components/JournalEntryCard";
import { Accordion } from "@components/ui/accordion";

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
};

type JournalEntryListProps = {
  journalEntries: JournalEntryProps[];
};

const JournalEntryList = ({ journalEntries }: JournalEntryListProps) => {
  return (
    <Accordion type="single" className="pb-1">
      {journalEntries.map((journalEntry) => {
        const { _id, createDate, dailyWillpower } = journalEntry;
        const date = new Date(createDate);

        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;

        return (
          <JournalEntryCard
            id={_id}
            formattedDate={formattedDate}
            dailyWillpower={dailyWillpower}
          />
        );
      })}
    </Accordion>
  );
};

export default JournalEntryList;
