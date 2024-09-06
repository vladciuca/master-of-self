import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import LevelBarXpGain from "@components/LevelBarXpGain";
import { Button } from "@components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
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
        const newHabitXp = {
          ...prev,
          [habitId]: (prev[habitId] || 0) + xpChange,
        };
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
  }, [dailyWillpower, onChange]);

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center sticky top-0 bg-background z-10 pb-2">
        <div className="text-md font-semibold leading-relaxed text-muted-foreground mx-4">
          {"Unspent Willpower"}
        </div>
        <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
          {remainingWillpower}
          <FaBoltLightning className="ml-2" />
          {dailyWillpower !== remainingWillpower && (
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

      <div className="overflow-y-auto w-full mt-4">
        {!habitsLoaded && (
          <div className="h-full w-full flex justify-center items-center">
            <div className="loader" />
          </div>
        )}
        {habitsLoaded && (
          <div>
            {habits?.map((habit) => {
              const { _id, name, icon, xp } = habit;
              return (
                <div
                  key={_id}
                  className="flex flex-col items-center justify-center my-8 mx-4 sm:mx-8"
                >
                  <div className="w-full flex items-center justify-center space-x-4 mb-4">
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
                      <LevelBarXpGain
                        xp={xp}
                        xpChange={habitXp[_id] || 0}
                        icon={<em-emoji shortcodes={icon} size="1.6rem" />}
                      />
                      <div className="mt-2 flex-grow text-lg font-semibold tracking-wide">
                        {name}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-full mt-1"
                      onClick={() => handleXpUpdate(habit._id, 1)}
                      disabled={remainingWillpower < 1}
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
