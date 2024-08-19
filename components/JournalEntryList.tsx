import JournalEntryCard from "@components/JournalEntryCard";
import { Accordion } from "@components/ui/accordion";

type JournalEntryProps = {
  _id: string;
  createDate: Date;
  dailyWillpower: number;
  dayEntry?: string[];
  nightEntry?: string[];
};

type JournalEntryListProps = {
  journalEntries: JournalEntryProps[];
};

const JournalEntryList = ({ journalEntries }: JournalEntryListProps) => {
  return (
    <Accordion type="single" className="pb-1">
      {journalEntries.map((journalEntry) => {
        const { _id, createDate, dailyWillpower, dayEntry, nightEntry } =
          journalEntry;

        const date = new Date(createDate);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });

        return (
          <JournalEntryCard
            id={_id}
            day={day}
            month={month}
            dailyWillpower={dailyWillpower}
            dayEntry={dayEntry}
            nightEntry={nightEntry}
          />
        );
      })}
    </Accordion>
  );
};

export default JournalEntryList;
