import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import XpGainLevelBar from "@components/XpGainLevelBar";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import SkeletonHabitLevel from "@components/skeletons/SkeletonHabitLevel";
import { Minus, Plus, RotateCcw, Shell } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";
import { Session, Habit } from "@app/types/types";

init({ data });

type HabitsStepProps = {
  dailyWillpower: number;
  onChange: (value: { [key: string]: number }) => void;
  habitXpChanges?: { [key: string]: number };
};

const HabitsStep = ({
  dailyWillpower,
  onChange,
  habitXpChanges = {},
}: HabitsStepProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsLoaded, setHabitsLoaded] = useState(false);
  const [habitXp, setHabitXp] = useState<{ [key: string]: number }>(
    habitXpChanges
  );
  const [remainingWillpower, setRemainingWillpower] = useState(dailyWillpower);
  const { data: session } = useSession() as { data: Session | null };

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

  useEffect(() => {
    // Calculate remaining willpower based on existing habit XP
    const usedWillpower = Object.values(habitXp).reduce(
      (sum, xp) => sum + xp,
      0
    );
    setRemainingWillpower(dailyWillpower - usedWillpower);
  }, [dailyWillpower, habitXp]);

  const handleXpUpdate = useCallback(
    (habitId: string, xpChange: number) => {
      if (xpChange > 0 && xpChange > remainingWillpower) {
        return;
      }

      setHabitXp((prev) => {
        const newValue = (prev[habitId] || 0) + xpChange;
        const newHabitXp = { ...prev };

        if (newValue === 0) {
          delete newHabitXp[habitId];
        } else {
          newHabitXp[habitId] = newValue;
        }

        onChange(newHabitXp);
        return newHabitXp;
      });

      setRemainingWillpower((prev) => prev - xpChange);
    },
    [remainingWillpower, onChange]
  );

  const handleXpReset = useCallback(() => {
    setRemainingWillpower(dailyWillpower);
    setHabitXp({});
    onChange({});
  }, []);

  return (
    <div className="h-full">
      <div className="w-full flex flex-col h-full">
        <div className="text-center sticky top-0 bg-background z-10">
          <Label>
            <div className="leading-relaxed text-muted-foreground mx-4">
              {
                "Allocate your Willpower to the habits you worked on. Unspent Willpower:"
              }
            </div>
          </Label>

          <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
            {remainingWillpower}
            <FaBoltLightning className="ml-2" />
            {Object.values(habitXp).some((xp) => xp > 0) && (
              <Button
                variant={"outline"}
                className="ml-2 rounded-full p-2 w-10 h-10"
                onClick={handleXpReset}
              >
                <RotateCcw />
              </Button>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col h-full mt-2">
          {!habitsLoaded && <SkeletonHabitLevel />}

          {habitsLoaded && habits.length === 0 && (
            <div className="w-full h-full flex flex-col justify-evenly items-center flex-grow">
              <Label className="text-center">
                <div className="leading-relaxed text-muted-foreground mx-4">
                  {"You don't have any habits."}
                </div>
                <div className="leading-relaxed text-muted-foreground mx-4">
                  {"Lets create a new one right now!"}
                </div>
                <Link href="/create-habit">
                  <Button className="mt-5">
                    <Shell className="mr-2" />
                    Create a Habit
                  </Button>
                </Link>
              </Label>
              {/* empty div to position the content properly, better structure needed*/}
              <div></div>
            </div>
          )}
          {habitsLoaded && (
            <div>
              {habits?.map((habit) => {
                const { _id, name, icon, xp } = habit;
                return (
                  <div
                    key={_id}
                    className="flex flex-col items-center justify-center my-10 mx-4 sm:mx-8"
                  >
                    <div className="h-full flex items-center justify-center space-x-10">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full mt-1"
                        disabled={(habitXp[_id] || 0) === 0}
                        onClick={() => handleXpUpdate(habit._id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease</span>
                      </Button>

                      <div className="flex-1 text-center">
                        <XpGainLevelBar
                          xp={xp}
                          xpChange={habitXp[_id] || 0}
                          icon={<em-emoji shortcodes={icon} />}
                          name={name}
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full mt-1"
                        onClick={() => handleXpUpdate(habit._id, 1)}
                        disabled={remainingWillpower === 0}
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
    </div>
  );
};

export default HabitsStep;
