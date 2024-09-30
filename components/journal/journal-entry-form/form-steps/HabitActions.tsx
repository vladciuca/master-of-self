import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { useUserHabits } from "@hooks/useUserHabits";

// type HabitActionsProps = {
//   habits: string[];
// };

export function HabitActions() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  return (
    <FormStepTemplate
      title="Habit Actions"
      description="Build momentum by capturing meaningful events to boost tomorrow's Willpower."
    >
      <div>
        <div className="text-2xl">Habit Actions</div>
        <ol>
          {habits.map((habit) => (
            <li>{habit.name}</li>
          ))}
        </ol>
      </div>
    </FormStepTemplate>
  );
}
