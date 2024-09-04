import HabitCard from "@components/habits/HabitCard";
import NewEntry from "@components/NewEntry";
import { Accordion } from "@components/ui/accordion";
import { Shell } from "lucide-react";

type Habit = {
  _id: string;
  name: string;
  icon: string;
  description: string;
  xp: number;
  creator: {
    _id: string;
  };
};

type HabitListProps = {
  habits: Habit[];
  handleEdit: (habit: Habit) => void;
  handleDelete: (habit: Habit) => Promise<void>;
};

const NEW_HABIT_CARD_DETAILS = {
  symbol: <Shell className="mr-2" size={"2rem"} />,
  title: "Habits",
  description: (
    <>
      These represent <span className="text-foreground">actions</span> that you
      can take daily to progress on your missions.
    </>
  ),
  buttonText: "Create New Habit",
  linkTo: "/create-habit",
};

const HabitList = ({ habits, handleEdit, handleDelete }: HabitListProps) => {
  return (
    <>
      <NewEntry
        symbol={NEW_HABIT_CARD_DETAILS.symbol}
        title={NEW_HABIT_CARD_DETAILS.title}
        description={NEW_HABIT_CARD_DETAILS.description}
        buttonText={NEW_HABIT_CARD_DETAILS.buttonText}
        linkTo={NEW_HABIT_CARD_DETAILS.linkTo}
        numberOfEntries={habits.length}
      />
      <Accordion type="single" collapsible className="w-full pb-1">
        {habits.map((habit: Habit) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </Accordion>
    </>
  );
};

export default HabitList;
