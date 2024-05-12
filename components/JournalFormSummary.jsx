import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { Button } from "./ui/button";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

const JournalFormSummary = ({
  gratefulItems,
  habits,
  habitWillpower,
  submitting,
  handleSubmit,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        {Object.entries(habitWillpower).map(([key, value]) => {
          const habit = habits.find((habit) => habit._id === key);

          return (
            <div key={key} className="flex items-center justify-center">
              <em-emoji id={habit.icon} size="3rem" />
              <span className="mx-3 text-3xl">+{value}</span>
              <FaBoltLightning size="1.7rem" />
            </div>
          );
        })}
        <ol className="list-decimal mx-4 my-6">
          {gratefulItems?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
      <div className="flex justify-center items-center py-2">
        <Button
          type="button"
          disabled={submitting}
          className="w-2/3"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default JournalFormSummary;
