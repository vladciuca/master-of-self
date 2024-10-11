import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActions } from "../../../habits/habit-actions/HabitActions";
import { SkeletonHabitAction } from "@components/skeletons/SkeletonHabitAction";
import { useUserHabits } from "@/hooks/useUserHabits";
import { Habit } from "@app/types/types";

type HabitActionsProps = {
  onChange: (value: { [key: string]: { [key: string]: number } }) => void;
  actionChanges?: { [key: string]: { [key: string]: number } };
  // habitIdParam: string | null;
};

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitAction key={index} />
));

export function HabitActionsStep({
  onChange,
  actionChanges = {},
}: // habitIdParam,
HabitActionsProps) {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const [actionValues, setActionValues] = useState<{
    [key: string]: { [key: string]: number };
  }>(actionChanges);

  // console.log("=======IN STEP", habitIdParam);

  // Update local state when actionChanges prop changes
  useEffect(() => {
    setActionValues(actionChanges);
  }, [actionChanges]);

  const calculateProjectedXP = useCallback(
    (habit: Habit) => {
      const habitActions = actionValues[habit._id] || {};
      return Object.values(habitActions).reduce((sum, value) => sum + value, 0);
    },
    [actionValues]
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
      description="Track your progress on habit actions"
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
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </FormStepTemplate>
  );
}
