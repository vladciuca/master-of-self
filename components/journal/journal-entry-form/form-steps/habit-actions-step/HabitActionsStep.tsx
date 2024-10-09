import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { useUserHabits } from "@/hooks/useUserHabits";
import { Habit } from "@app/types/types";

import { HabitActionHeader } from "./HabitActionHeader";

type HabitActionsProps = {
  onChange: (value: { [key: string]: { [key: string]: number } }) => void;
  actionChanges?: { [key: string]: { [key: string]: number } };
};

export function HabitActionsStep({
  onChange,
  actionChanges = {},
}: HabitActionsProps) {
  const { habits, habitsLoading, habitsError } = useUserHabits();

  const [actionValues, setActionValues] = useState<{
    [key: string]: { [key: string]: number };
  }>(actionChanges);

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

  // const handleActionChange = useCallback(
  //   (habitId: string, actionId: string, newValue: number) => {
  //     setActionValues((prev) => {
  //       const newValues = { ...prev };
  //       if (!newValues[habitId]) {
  //         newValues[habitId] = {};
  //       }
  //       newValues[habitId][actionId] = newValue;

  //       if (newValues[habitId][actionId] === 0) {
  //         delete newValues[habitId][actionId];
  //       }
  //       if (Object.keys(newValues[habitId]).length === 0) {
  //         delete newValues[habitId];
  //       }

  //       onChange(newValues);
  //       return newValues;
  //     });
  //   },
  //   [onChange]
  // );

  if (habitsLoading) {
    return <div>Loading habits...</div>;
  }

  if (habitsError) {
    return <div>Error loading habits: {habitsError}</div>;
  }

  return (
    <FormStepTemplate
      title="Habit Actions"
      description="Track your progress on habit actions"
    >
      <>
        {habits.map((habit) => (
          <HabitActionHeader
            habit={habit}
            projectedXp={calculateProjectedXP(habit)}
          />
        ))}
      </>
    </FormStepTemplate>
  );
}

{
  /* <HabitActions
        habit={habit}
        projectedHabitXp={calculateProjectedXP(habit)}
        onChange={handleActionChange}
        actionChanges={actionChanges}
      /> */
}
