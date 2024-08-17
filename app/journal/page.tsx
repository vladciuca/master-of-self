import UserJournal from "@components/UserJournal";
import NewEntry from "@components/NewEntry";
import { FaSun, FaMoon } from "react-icons/fa";

const NEW_JOURNAL_ENTRY_CARD_DETAILS = {
  symbol: {
    day: <FaSun className="mr-2" />,
    night: <FaMoon className="mr-2" />,
  },
  title: {
    day: "Day Entry",
    night: "Night Entry",
  },
  description: {
    day: "Generate willpower and rise to today's challenges.",
    night: "Spend willpower on actions to increase mission progress.",
  },
  buttonText: {
    day: "Start today's Journal",
    night: "Finish today's Journal",
  },
  linkTo: {
    day: "/create-journal-entry",
    night: "",
  },
};

const Journal = () => {
  return (
    <div>
      <NewEntry
        symbol={NEW_JOURNAL_ENTRY_CARD_DETAILS.symbol.day}
        title={NEW_JOURNAL_ENTRY_CARD_DETAILS.title.day}
        description={NEW_JOURNAL_ENTRY_CARD_DETAILS.description.day}
        buttonText={NEW_JOURNAL_ENTRY_CARD_DETAILS.buttonText.day}
        linkTo={NEW_JOURNAL_ENTRY_CARD_DETAILS.linkTo.day}
      />
      {/* <NewEntry
        symbol={NEW_JOURNAL_ENTRY_CARD_DETAILS.symbol.night}
        title={NEW_JOURNAL_ENTRY_CARD_DETAILS.title.night}
        description={NEW_JOURNAL_ENTRY_CARD_DETAILS.description.night}
        buttonText={NEW_JOURNAL_ENTRY_CARD_DETAILS.buttonText.night}
      /> */}
      <UserJournal />
    </div>
  );
};

export default Journal;
