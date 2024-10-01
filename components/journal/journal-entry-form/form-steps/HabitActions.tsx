import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { IconRenderer } from "@components/IconRenderer";
import { useUserHabits } from "@hooks/useUserHabits";
import { CircleAlert } from "lucide-react";

// type HabitActionsProps = {
//   habits: string[];
// };

export function HabitActions() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  return (
    <FormStepTemplate title="Habit Actions" description="??">
      <div>
        <ol>
          {habits.map((habit) => {
            const { _id, name, description, icon, xp } = habit;
            return (
              <li key={_id} className="mb-8">
                <div className="flex items-center">
                  <IconRenderer iconName={icon} xp={xp} className="text-6xl" />
                  <div className="ml-2">
                    <span className="text-2xl">{name}</span>
                    <div className="text-sm">{description}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <span>
                      <CircleAlert />
                    </span>
                    action 1
                  </div>
                  <div className="flex items-center">
                    <span>
                      <CircleAlert />
                    </span>
                    action 2
                  </div>
                  <div className="flex items-center">
                    <span>
                      <CircleAlert />
                    </span>
                    action 3
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </FormStepTemplate>
  );
}
