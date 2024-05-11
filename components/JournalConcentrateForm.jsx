"use client";

import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JournalFormResource from "./JournalFormResource";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

const JournalConcentrateForm = ({ willpower }) => {
  const { data: session } = useSession();
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  const [habitWillpower, setHabitWillpower] = useState({});

  const willpowerSpent = Object.values(habitWillpower).reduce(
    (acc, currentValue) => acc + currentValue,
    0
  );

  const remainingWillpower = willpower - willpowerSpent;

  const handleAddWillpower = (habitId) => {
    setHabitWillpower((prevState) => ({
      ...prevState,
      [habitId]: (prevState[habitId] || 0) + 1,
    }));
  };

  const handleSubtractWillpower = (habitId) => {
    setHabitWillpower((prevState) => ({
      ...prevState,
      [habitId]: (prevState[habitId] || 0) - 1,
    }));
  };

  useEffect(() => {
    const fetchHabits = async () => {
      setHabitsLoaded(false);
      try {
        const response = await fetch(`/api/users/${session?.user.id}/habits`);
        const data = await response.json();
        setHabits(data.reverse());
      } catch (error) {
        console.error("Failed to fetch habits", error);
      } finally {
        setHabitsLoaded(true);
      }
    };

    if (session?.user.id) {
      fetchHabits();
    }
  }, [session]);

  return (
    <div className="grid grid-rows-[1fr,auto] h-full">
      <div className="flex flex-col items-center justify-center">
        <JournalFormResource resource={remainingWillpower} />
        {!habitsLoaded && (
          <div className="h-full w-full flex justify-center items-center">
            <div className="loader" />
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full px-8 mt-4">
        {habitsLoaded && (
          <div>
            {habits?.map((habit) => {
              const { _id, name, icon } = habit;

              return (
                <div className="flex items-center justify-center space-x-2 my-8 mx-6 sm:mx-8">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => handleSubtractWillpower(_id)}
                    disabled={(habitWillpower[_id] || 0) === 0}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center text-xl">
                      + <span className="mx-1">{habitWillpower[_id] || 0}</span>
                      <FaBoltLightning size="1rem" />
                    </div>
                    <div className="text-2xl font-bold tracking-wide">
                      <span className="mr-2">
                        <em-emoji id={icon} size="1.8rem" />
                      </span>
                      {name}
                    </div>
                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                      Level
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => handleAddWillpower(_id)}
                    disabled={willpowerSpent === willpower}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalConcentrateForm;
