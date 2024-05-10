"use client";

import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";

init({ data });

const JournalConcentrateForm = () => {
  const { data: session } = useSession();
  const [habits, setHabits] = useState([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);

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
    <div className="mt-6">
      {!habitsLoaded && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="loader" />
        </div>
      )}

      {habitsLoaded && (
        <div>
          {habits?.map((habit) => {
            console.log("===HABIT", habit);
            const { name, icon } = habit;

            return (
              <div className="flex items-center justify-center space-x-2 my-8 mx-6 sm:mx-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  //   onClick={() => onClick(-10)}
                  //   disabled={goal <= 200}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center text-xl">
                    + <span className="mr-1">{"0"}</span>
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
                  //   onClick={() => onClick(10)}
                  //   disabled={goal >= 400}
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
  );
};

export default JournalConcentrateForm;
