import {
  useEffect,
  useCallback,
  //  useMemo, useRef,
  useState,
} from "react";
import { FormStepTemplate } from "@/components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActions } from "@components/habits/habit-actions/HabitActions";
import { SkeletonHabitAction } from "@components/skeletons/SkeletonHabitAction";
import { useUserHabits } from "@/hooks/useUserHabits";
import type { Habit, Habits } from "@models/types";
import {
  // deepMergeHabitsWithNewDefaultValues,
  // getHabitActionDefaultValues,
  calculateHabitsXpFromEntry,
} from "@lib/level";
import { XP_COLORS } from "@lib/colors";

type HabitActionsProps = {
  onChange: (value: Habits) => void;
  actionChanges?: Habits;
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
  // const initialMergeRef = useRef(false);
  const [localActionValues, setLocalActionValues] =
    useState<Habits>(actionChanges);

  // Calculate default values based on habits
  // const latestDefaultHabitActionValues = useMemo(
  //   () => getHabitActionDefaultValues(habits, { includeCurrentXp: true }),
  //   [habits]
  // );

  // Merge actionChanges with default values
  // const mergedActionValues = useMemo(
  //   () =>
  //     deepMergeHabitsWithNewDefaultValues(
  //       localActionValues,
  //       latestDefaultHabitActionValues
  //     ),
  //   [localActionValues, latestDefaultHabitActionValues]
  // );

  // Call onChange with merged values only once when the component mounts
  // useEffect(() => {
  //   if (!initialMergeRef.current) {
  //     setLocalActionValues(mergedActionValues);
  //     // onChange(mergedActionValues);
  //     initialMergeRef.current = true;
  //   }
  // }, [onChange, mergedActionValues]);
  useEffect(() => {
    setLocalActionValues(actionChanges);
  }, [onChange, actionChanges]);

  // useEffect(() => {
  //   onChange(mergedActionValues);
  // }, [mergedActionValues]);

  const calculateProjectedXP = useCallback(
    (habit: Habit) => {
      const xpSums = calculateHabitsXpFromEntry(
        localActionValues,
        dailyWillpower
      );
      return xpSums[habit._id] || 0;
    },
    [localActionValues, dailyWillpower]
  );

  // This function updates individual action values and calls the grandfather's onChange
  const handleActionChange = useCallback(
    (habitId: string, actionId: string, newValue: number) => {
      setLocalActionValues((prev) => {
        const updatedValues = { ...prev };
        if (!updatedValues[habitId]) {
          updatedValues[habitId] = {
            currentXp: habits.find((h) => h._id === habitId)?.xp || 0,
          };
        }
        updatedValues[habitId][actionId] = newValue;
        onChange(updatedValues);
        return updatedValues;
      });
    },
    [onChange, habits]
  );

  return (
    <FormStepTemplate
      title="Habits"
      description="Track your progress on habits. Get 1% bonus XP for each Willpower point earned."
      scoreSection={
        dailyWillpower > 0 && (
          <>
            <span className={`text-${XP_COLORS.positive}`}>
              +{dailyWillpower}%
            </span>
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
                  // actionChanges={mergedActionValues[habit._id]}
                  actionChanges={actionChanges[habit._id]}
                  habitsLoading={habitsLoading}
                  dailyWillpower={dailyWillpower}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </FormStepTemplate>
  );
}
