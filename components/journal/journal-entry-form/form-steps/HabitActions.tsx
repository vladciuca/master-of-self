import { useState } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { HabitCardHeader } from "@components/habits/habit-card/HabitCardHeader";
import { Checkbox } from "@components/ui/checkbox";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { useUserHabits } from "@hooks/useUserHabits";
import {
  Minus,
  Plus,
  CircleAlert,
  OctagonAlert,
  Hash,
  Clock,
} from "lucide-react";
import { Action } from "@app/types/types";

type HabitActionProps = {
  action: Action;
};

export function HabitAction({ action }: HabitActionProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="px-4 my-6">
      <div className="text flex justify-between items-center border-b pb-1 mb-4">
        <div className="flex items-center">
          {action.type === "offensive" ? (
            <CircleAlert className="mr-2 text-blue-500" size={24} />
          ) : (
            <OctagonAlert className="mr-2 text-blue-500" size={24} />
          )}
          {action.action}
        </div>

        <Checkbox
          className="h-8 w-8 mr-4"
          checked={isChecked}
          onClick={() => setIsChecked(!isChecked)}
        />
      </div>

      {isChecked && (
        <div>
          <div className="flex justify-center items-center space-x-10">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              // disabled={}
              // onClick={}
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
                <span className="text-xl">{action.value}</span>
              </Badge>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              // onClick={}
              // disabled={}
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
                    return <HabitAction action={action} />;
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
