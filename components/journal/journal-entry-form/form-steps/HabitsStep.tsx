"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import LevelBar from "@components/LevelBar";
import { Button } from "@components/ui/button";
import { Minus, Plus } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";
import { Session } from "@app/types/types";

init({ data });

const HabitsStep = ({}) => {
  // list of habits
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  // list of willpower into skills
  const [habitXp, setHabitXp] = useState({});
  const { data: session } = useSession() as { data: Session | null };
  //   const willpowerSpent = Object.values(habitWillpower).reduce(
  //     (acc, currentValue) => acc + currentValue,
  //     0
  //   );

  //   const remainingWillpower = gratefulItems.length - willpowerSpent;

  //   const handleAddWillpower = (habitId) => {
  //     setHabitWillpower((prevState) => ({
  //       ...prevState,
  //       [habitId]: (prevState[habitId] || 0) + 1,
  //     }));
  //   };

  //   const handleSubtractWillpower = (habitId) => {
  //     setHabitWillpower((prevState) => ({
  //       ...prevState,
  //       [habitId]: (prevState[habitId] || 0) - 1,
  //     }));
  //   };

  //   TODO: adapt and submit on Next button
  //   const handleSubmit = async () => {
  //     if (gratefulItems.length <= 0) return;
  //     onSubmit(gratefulItems, habitWillpower);

  //     for (const habitId in habitWillpower) {
  //       const resource = habitWillpower[habitId];
  //       await updateHabit({ habitId, resource });
  //     }
  //   };

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
        {/* <h1 className="text-6xl">{remainingWillpower}</h1> */}
        {!habitsLoaded && (
          <div className="h-full w-full flex justify-center items-center">
            <div className="loader" />
          </div>
        )}
      </div>

      <div className="overflow-y-auto w-full mt-4">
        {habitsLoaded && (
          <div>
            {habits?.map((habit) => {
              const { _id, name, icon } = habit;

              return (
                <div
                  key={_id}
                  className="flex flex-col items-center justify-center my-8 mx-4 sm:mx-8"
                >
                  <div className="flex items-center justify-center text-xl rounded-full border py-1 px-2">
                    <span className="mx-1 font-semibold">+{0}</span>
                    {/* + <span className="mx-1">{habitWillpower[_id] || 0}</span> */}
                    <FaBoltLightning />
                  </div>
                  <div className="w-full flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      // onClick={() => handleSubtractWillpower(_id)}
                      // disabled={(habitWillpower[_id] || 0) === 0}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex-1 text-center">
                      {/* <Progress className="h-4 my-2" /> */}
                      <LevelBar
                        // Add xp here
                        xp={123}
                        icon={<em-emoji shortcodes={icon} size="1.8rem" />}
                      />
                      <div className="mt-2 flex-grow text-lg font-semibold tracking-wide">
                        {name}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full"
                      // onClick={() => handleAddWillpower(_id)}
                      // disabled={willpowerSpent === gratefulItems.length}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsStep;
