import UserHabits from "@components/UserHabits";
import NewEntry from "@components/NewEntry";
import { Target } from "lucide-react";

const NEW_HABIT_CARD_DETAILS = {
  symbol: <Target className="mr-2" />,
  title: "Habits",
  description:
    "These represent actions that you take daily to progress on your missions.",
  buttonText: "Create New Habit",
};

const Habits = () => {
  return (
    <div>
      <NewEntry
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        description={NEW_HABIT_CARD_DETAILS.description}
        buttonText={NEW_HABIT_CARD_DETAILS.buttonText}
      />
      <UserHabits />
    </div>
  );
};

export default Habits;
