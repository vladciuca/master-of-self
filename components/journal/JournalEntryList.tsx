import { NewJournalEntry } from "@components/journal/NewJournalEntry";
import { JournalEntryCard } from "@components/journal/journal-entry-card/JournalEntryCard";
import { Accordion } from "@components/ui/accordion";
import { isEvening } from "@lib/time";
import { JournalEntryMetadata } from "@models/types";
import { useUserSettings } from "@hooks/useUserSettings";

type JournalEntryListProps = {
  journalEntries: JournalEntryMetadata[];
  // handleDelete: (journalEntry: JournalEntryMetadata) => Promise<void>;
};

export function JournalEntryList({
  journalEntries,
}: // handleDelete,
JournalEntryListProps) {
  const { userSettings, userSettingsLoading } = useUserSettings();
  const isEveningTime = isEvening(userSettings.journalStartTime.evening);
  const hasTodayEntry = journalEntries.some((entry) => {
    const entryDate = new Date(entry.createDate);
    const currentDate = new Date();
    return entryDate.toLocaleDateString() === currentDate.toLocaleDateString();
  });

  return (
    <>
      {!hasTodayEntry && <NewJournalEntry isEveningTime={isEveningTime} />}
      <Accordion type="single" collapsible className="pb-1">
        {journalEntries.map((journalEntry, index) => {
          return (
            <JournalEntryCard
              key={index}
              journalEntry={journalEntry}
              isEveningTime={isEveningTime}
              // handleDelete={handleDelete}
            />
          );
        })}
      </Accordion>
    </>
  );
}
