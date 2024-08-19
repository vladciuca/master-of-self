import UserJournal from "@components/UserJournal";
import NewEntry from "@components/NewEntry";
import { FaSun, FaMoon } from "react-icons/fa";

const NEW_JOURNAL_ENTRY_CARD_DETAILS = {
  symbol: {
    day: <FaSun size="1.5rem" className="mr-2" />,
    night: <FaMoon size="1.5rem" className="mr-2" />,
  },
  title: {
    day: "Day Entry",
    night: "Night Entry",
  },
  description: {
    day: "generate willpower to rise to today's challenges.",
    night: "spend willpower on habits to increase mission progress.",
  },
  buttonText: {
    day: "Start today's Journal",
    night: "Finish today's Journal",
  },
  linkTo: {
    day: "/create-journal-entry?time=day",
    night: "/update-journal-entry?time=night",
  },
};

// searchParams is used only for faster TESTING purposes
// to be deleted after dynamic day / night feature implementation

const Journal = ({ searchParams }: { searchParams: { time: string } }) => {
  return (
    <div>
      {searchParams.time !== "night" ? (
        <NewEntry
          symbol={NEW_JOURNAL_ENTRY_CARD_DETAILS.symbol.day}
          title={NEW_JOURNAL_ENTRY_CARD_DETAILS.title.day}
          description={NEW_JOURNAL_ENTRY_CARD_DETAILS.description.day}
          buttonText={NEW_JOURNAL_ENTRY_CARD_DETAILS.buttonText.day}
          linkTo={NEW_JOURNAL_ENTRY_CARD_DETAILS.linkTo.day}
        />
      ) : (
        <NewEntry
          symbol={NEW_JOURNAL_ENTRY_CARD_DETAILS.symbol.night}
          title={NEW_JOURNAL_ENTRY_CARD_DETAILS.title.night}
          description={NEW_JOURNAL_ENTRY_CARD_DETAILS.description.night}
          buttonText={NEW_JOURNAL_ENTRY_CARD_DETAILS.buttonText.night}
          linkTo={NEW_JOURNAL_ENTRY_CARD_DETAILS.linkTo.night}
        />
      )}
      <UserJournal />
    </div>
  );
};

export default Journal;
