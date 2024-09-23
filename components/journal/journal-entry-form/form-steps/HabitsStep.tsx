import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { XpGainLevelBar } from "@components/XpGainLevelBar";
import { IconRenderer } from "@components/IconRenderer";
import { Button } from "@components/ui/button";
import { SkeletonHabitLevel } from "@components/skeletons/SkeletonHabitLevel";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { FaBoltLightning } from "react-icons/fa6";
import { useFetchUserHabits } from "@hooks/useFetchUserHabits";

type HabitsStepProps = {
  dailyWillpower: number;
  onChange: (value: { [key: string]: number }) => void;
  habitXpChanges?: { [key: string]: number };
};

export function HabitsStep({
  dailyWillpower,
  onChange,
  habitXpChanges = {},
}: HabitsStepProps) {
  const [habitXp, setHabitXp] = useState<{ [key: string]: number }>(
    habitXpChanges
  );
  const [remainingWillpower, setRemainingWillpower] = useState(dailyWillpower);
  const { habits, habitsLoading, habitsError } = useFetchUserHabits();

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
    <FormStepTemplate
      title="How did I manage my Willpower?"
      description="Allocate your Willpower to the habits you worked on. Unspent Willpower:"
      scoreSection={
        <div className="text-4xl my-3 pb-4 flex items-center justify-center font-semibold">
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
      }
    >
      <div className="w-full flex flex-col h-full mt-2">
        {habitsLoading && <SkeletonHabitLevel />}
        {!habitsLoading && habits && (
          <div>
            {habits?.map((habit) => {
              const { _id, name, icon, xp } = habit;
              return (
                <div
                  key={_id}
                  className="flex flex-col items-center justify-center mb-8 mx-4 sm:mx-8"
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
                        icon={<IconRenderer iconName={icon} xp={xp} />}
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
    </FormStepTemplate>
  );
}
