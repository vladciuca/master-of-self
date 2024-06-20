import UserJournal from "@components/UserJournal";
import NewJournalEntry from "@components/NewJournalEntry";

const Journal = () => {
  return (
    <div>
      <NewJournalEntry />
      <UserJournal />
    </div>
  );
};

export default Journal;
