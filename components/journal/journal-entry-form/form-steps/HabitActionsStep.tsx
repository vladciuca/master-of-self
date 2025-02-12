import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActions } from "../../../habits/habit-actions/HabitActions";
import { SkeletonHabitAction } from "@components/skeletons/SkeletonHabitAction";
import { useUserHabits } from "@/hooks/useUserHabits";
import { Habit, Actions } from "@app/types/types";
import { calculateHabitsXpFromEntry } from "@lib/level";

type HabitActionsProps = {
  onChange: (value: Actions) => void;
  actionChanges?: Actions;
  dailyWillpower: number;
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitAction key={index} />
));

export function HabitActionsStep({
  onChange,
  actionChanges = {},
  dailyWillpower,
}: HabitActionsProps) {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const [actionValues, setActionValues] = useState<Actions>(actionChanges);

  const willpowerMultiplier = 1 + dailyWillpower / 100;

  // Update local state when actionChanges prop changes
  useEffect(() => {
    setActionValues(actionChanges);
  }, [actionChanges]);

  // Update currentXp when habits change
  useEffect(() => {
    if (habits) {
      setActionValues((prev) => {
        const newValues = { ...prev };
        habits.forEach((habit) => {
          if (
            newValues[habit._id] &&
            Object.keys(newValues[habit._id]).length > 1
          ) {
            newValues[habit._id].currentXp = habit.xp;
          }
        });
        return newValues;
      });
    }
  }, [habits]);

  const calculateProjectedXP = useCallback(
    (habit: Habit) => {
      const xpSums = calculateHabitsXpFromEntry(actionValues, dailyWillpower);
      return xpSums[habit._id] || 0;
    },
    [actionValues, willpowerMultiplier]
  );

  // THIS FUNCTION UPDATES THE CURRENT XP for the current DAY
  const handleActionChange = useCallback(
    (habitId: string, actionId: string, newValue: number) => {
      setActionValues((prev) => {
        const newValues = { ...prev };
        if (!newValues[habitId]) {
          newValues[habitId] = {
            currentXp: habits.find((h) => h._id === habitId)?.xp || 0,
          };
        }
        newValues[habitId][actionId] = newValue;

        onChange(newValues);
        return newValues;
      });
    },
    [onChange, habits]
  );

  return (
    <FormStepTemplate
      title="Habit Actions"
      description="Track your progress on habit actions. Get 1% bonus XP for each Willpower point earned."
      scoreSection={
        dailyWillpower > 0 && (
          <>
            <span className="text-green-500">+{dailyWillpower}%</span>
            <span className="ml-2 text-2xl">XP</span>
          </>
        )
      }
    >
      <div>
        {habitsLoading && <>{skeletonCards}</>}
        {!habitsLoading && !habitsError && (
          <ol>
            {habits.map((habit) => (
              <li key={habit._id} className="mb-8">
                <HabitActions
                  habit={habit}
                  projectedHabitXp={calculateProjectedXP(habit)}
                  onChange={handleActionChange}
                  // actionChanges={actionChanges[habit._id] || {}}
                  actionChanges={actionChanges[habit._id]}
                  habitsLoading={habitsLoading}
                  willpowerMultiplier={willpowerMultiplier}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </FormStepTemplate>
  );
}
