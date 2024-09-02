import React from "react";
import NewEntry from "@components/NewEntry";
import { Target } from "lucide-react";

const NEW_MISSION_CARD_DETAILS = {
  symbol: <Target className="mr-2" size={"2rem"} />,
  title: "Goals",
  description: (
    <>
      These create a clear <span className="text-foreground">roadmap</span> for
      the journey ahead.
    </>
  ),
  buttonText: "Start a New Mission",
  linkTo: "/create-mission",
};

const Missions = () => {
  return (
    <div>
      <NewEntry
        symbol={NEW_MISSION_CARD_DETAILS.symbol}
        title={NEW_MISSION_CARD_DETAILS.title}
        description={NEW_MISSION_CARD_DETAILS.description}
        buttonText={NEW_MISSION_CARD_DETAILS.buttonText}
        linkTo={NEW_MISSION_CARD_DETAILS.linkTo}
        numberOfEntries={0}
      />
    </div>
  );
};

export default Missions;
