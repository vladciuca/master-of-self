import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { Checkbox } from "@components/ui/checkbox";
import { useUserHabits } from "@hooks/useUserHabits";
import {
  CircleX,
  Plus,
  CircleAlert,
  OctagonAlert,
  Hash,
  Clock,
} from "lucide-react";

export function HabitActions() {
  const { habits, habitsLoading, habitsError } = useUserHabits();
  return (
    <FormStepTemplate title="Habit Actions" description="??">
      <div>
        <ol>
          {habits.map((habit) => {
            return (
              <li key={habit._id} className="mb-8">
                <HabitCardHeader habit={habit} />
                <div>
                  {habit.actions.map((action) => {
                    return (
                      <div className="px-4 my-4">
                        <div className="text flex justify-between items-center border-b pb-1 mb-2">
                          <div className="flex items-center">
                            {action.type === "offensive" ? (
                              <CircleAlert
                                className="mr-2 text-blue-500"
                                size={20}
                              />
                            ) : (
                              <OctagonAlert
                                className="mr-2 text-blue-500"
                                size={20}
                              />
                            )}
                            {action.action}
                          </div>
                          {/* <button
                            type="button"
                            // onClick={() => removeAction(index)}
                            className="ml-2 text-red-500"
                            aria-label={`Remove action ${action.action}`}
                          >
                            <CircleX size={20} />
                          </button> */}
                          <Checkbox className="h-8 w-8" />
                        </div>
                        {/* <div className="flex items-center space-x-1">
                          <Badge variant="secondary" className="capitalize">
                            {action.type}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {action.metric === "count" ? (
                              <Hash size={18} className="mr-2" />
                            ) : (
                              <Clock size={18} className="mr-2" />
                            )}
                            {action.metric}
                          </Badge>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </FormStepTemplate>
  );
}
