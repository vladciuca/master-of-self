import JournalEntryCard from "@components/JournalEntryCard";
import NewJournalEntry from "@components/journal-entry-form/NewJournalEntry";
import { Accordion } from "@components/ui/accordion";
// import { FaSun, FaMoon } from "react-icons/fa";

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
};

type JournalEntryListProps = {
  journalEntries: JournalEntryProps[];
};

const JournalEntryList = ({ journalEntries }: JournalEntryListProps) => {
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
          const { _id, createDate, dailyWillpower, dayEntry, nightEntry } =
            journalEntry;

          const entryDate = new Date(createDate);
          const currentDate = new Date();
          const isToday =
            entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
          const day = entryDate.getDate();
          const month = entryDate.toLocaleString("default", { month: "short" });

          return (
            <JournalEntryCard
              id={_id}
              day={day}
              month={month}
              isToday={isToday}
              dailyWillpower={dailyWillpower}
              dayEntry={dayEntry}
              nightEntry={nightEntry}
            />
          );
        })}
      </Accordion>
    </>
  );
};

export default JournalEntryList;
