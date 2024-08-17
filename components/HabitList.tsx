import HabitCard from "@components/HabitCard";
import { Accordion } from "@components/ui/accordion";

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

const HabitList = ({ habits, handleEdit, handleDelete }: HabitListProps) => {
  return (
    <Accordion type="single" className="w-full">
      {habits.map((habit: Habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </Accordion>
  );
};

export default HabitList;
