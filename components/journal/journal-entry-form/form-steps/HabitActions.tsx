import { useState, useEffect, useCallback } from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActionsHeader } from "@components/journal/journal-entry-form/form-steps/habit-actions/HabitActionsHeader";
import { ActionIcon } from "@components/habits/HabitActionFragments";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserHabits } from "@/hooks/useUserHabits";
import { Minus, Plus, Hash, Clock } from "lucide-react";
import { Action, Habit } from "@/app/types/types";

type HabitActionProps = {
  action: Action;
  habitId: string;
  actionValue: number;
  onActionChange: (habitId: string, actionId: string, newValue: number) => void;
};

// Modified HabitAction component
export function HabitAction({
  action,
  habitId,
  actionValue,
  onActionChange,
}: HabitActionProps) {
  // Use local state to manage checkbox
  const [isChecked, setIsChecked] = useState(actionValue >= 1);

  const handleIncrease = () => {
    // Call onActionChange with the new value instead of the change amount
    onActionChange(habitId, action.id, actionValue + 1);
  };

  const handleDecrease = () => {
    // Call onActionChange with the new value instead of the change amount
    onActionChange(habitId, action.id, Math.max(0, actionValue - 1));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className="px-4 my-6">
      <div className="text flex justify-between items-center border-b pb-1 mb-4">
        <div className="flex items-center">
          <ActionIcon type={action.type} />
          {action.action}
        </div>

        <Checkbox
          className="h-8 w-8 mr-4"
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          disabled={actionValue > 0}
        />
      </div>

      {isChecked && (
        <div>
          <div className="flex justify-center items-center space-x-10">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              disabled={actionValue <= 0}
              onClick={handleDecrease}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div>
              <Badge variant="outline" className="capitalize">
                {action.metric === "count" ? (
                  <Hash size={18} className="mr-2" />
                ) : (
                  <Clock size={18} className="mr-2" />
                )}
                <span className="text-xl">{actionValue}</span>
              </Badge>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

type HabitActionsProps = {
  onChange: (value: { [key: string]: { [key: string]: number } }) => void;
  actionChanges?: { [key: string]: { [key: string]: number } };
};

// Modified HabitActions component
export function HabitActions({
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
      <div>
        <ol>
          {habits.map((habit) => (
            <li key={habit._id} className="mb-8">
              <HabitActionsHeader
                habit={habit}
                projectedHabitXp={calculateProjectedXP(habit)}
              />

              <div>
                {habit.actions.map((action) => (
                  <HabitAction
                    key={action.id}
                    action={action}
                    habitId={habit._id}
                    actionValue={actionValues[habit._id]?.[action.id] || 0}
                    onActionChange={handleActionChange}
                  />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </FormStepTemplate>
  );
}
