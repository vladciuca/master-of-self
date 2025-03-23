import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitActions } from "@components/habits/habit-actions/HabitActions";
import { SkeletonHabitAction } from "@components/skeletons/SkeletonHabitAction";
import { useUserHabits } from "@hooks/habits/useUserHabits";
import { calculateHabitsXpFromEntry } from "@lib/level";
import { XP_COLORS } from "@lib/colors";
import type { Habit, JournalEntry } from "@models/types";

const skeletonCards = Array.from({ length: 3 }, (_, index) => (
  <SkeletonHabitAction key={index} />
));

export function HabitActionsStep() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  const { watch, setValue } = useFormContext<JournalEntry>();

  const dailyWillpower = watch("dailyWillpower");
  const bonusWillpower = watch("bonusWillpower");
  const totalWillpower = dailyWillpower + bonusWillpower;
  const todaysHabits = watch("habits");

  const calculateProjectedXP = useCallback(
    (habit: Habit) => {
      const xpSums = calculateHabitsXpFromEntry({
        entryHabits: todaysHabits,
        entryWillpower: totalWillpower,
      });
      return xpSums[habit._id] || 0;
    },
    [todaysHabits, totalWillpower]
  );

  // NOTE: we do not set current XP here anymore as 0 (default) - will be handled in hook
  const handleActionChange = useCallback(
    (habitId: string, actionId: string, newValue: number) => {
      setValue(`habits.${habitId}.${actionId}`, newValue, {
        shouldDirty: true,
      });
    },
    [setValue]
  );

  return (
    <FormStepTemplate
      title="Habits"
      description="Track your progress on habits. Get 1% bonus XP for each Willpower point earned."
      scoreSection={
        totalWillpower > 0 && (
          <>
            <span className={`text-${XP_COLORS.positive}`}>
              +{totalWillpower}%
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
                  actionChanges={todaysHabits[habit._id]}
                  habitsLoading={habitsLoading}
                  totalWillpower={totalWillpower}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </FormStepTemplate>
  );
}
