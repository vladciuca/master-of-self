import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActions } from "../../../habits/habit-actions/HabitActions";
import { SkeletonHabitAction } from "@components/skeletons/SkeletonHabitAction";
import { FaBoltLightning } from "react-icons/fa6";
import { useUserHabits } from "@/hooks/useUserHabits";
import { Habit } from "@app/types/types";

type HabitActionsProps = {
  onChange: (value: { [key: string]: { [key: string]: number } }) => void;
  actionChanges?: { [key: string]: { [key: string]: number } };
  dailyWillpower: number;
  // habitIdParam: string | null;
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitAction key={index} />
));

export function HabitActionsStep({
  onChange,
  actionChanges = {},
  dailyWillpower,
}: // habitIdParam,
HabitActionsProps) {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const [actionValues, setActionValues] = useState<{
    [key: string]: { [key: string]: number };
  }>(actionChanges);

  const willpowerMultiplier = 1 + dailyWillpower / 100;

  // Update local state when actionChanges prop changes
  useEffect(() => {
    setActionValues(actionChanges);
  }, [actionChanges]);

  const calculateProjectedXP = useCallback(
    (habit: Habit) => {
      const habitActions = actionValues[habit._id] || {};
      // return Object.values(habitActions).reduce((sum, value) => sum + value, 0);
      // Calculate the base XP sum
      const baseXP = Object.values(habitActions).reduce(
        (sum, value) => sum + value,
        0
      );
      // Apply the willpower multiplier and round to the nearest integer
      return Math.round(baseXP * willpowerMultiplier);
    },
    [actionValues, willpowerMultiplier]
  );

  const handleActionChange = useCallback(
    (habitId: string, actionId: string, newValue: number) => {
      setActionValues((prev) => {
        const newValues = { ...prev };
        if (!newValues[habitId]) {
          newValues[habitId] = {};
        }
        newValues[habitId][actionId] = newValue;

        if (newValues[habitId][actionId] === 0) {
          delete newValues[habitId][actionId];
        }
        if (Object.keys(newValues[habitId]).length === 0) {
          delete newValues[habitId];
        }

        onChange(newValues);
        return newValues;
      });
    },
    [onChange]
  );

  return (
    <FormStepTemplate
      title="Habit Actions"
      description="Track your progress on habit actions. Get 1% bonus xp for each Willpower point"
      scoreSection={
        dailyWillpower > 0 && (
          <div className="text-4xl mt-3 flex items-baseline justify-center font-semibold">
            <span className="text-green-500">+{dailyWillpower}%</span>
            <span className="ml-2 text-2xl">XP</span>
          </div>
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
                  actionChanges={actionChanges}
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
