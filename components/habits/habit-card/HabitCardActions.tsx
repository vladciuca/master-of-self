import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { formatNumberSuffixes } from "@lib/utils";
import { HabitAction } from "@app/types/types";

type HabitCardActionsProps = {
  actions: HabitAction[];
  actionUpdateValues: { [key: string]: number };
  isNotToday: boolean;
};

export function HabitCardActions({
  actions,
  actionUpdateValues,
  isNotToday,
}: HabitCardActionsProps) {
  return (
    <div>
      {actions.map((action) => {
        const isDailyTargetCompleted =
          !isNotToday && actionUpdateValues[action.id] >= action.dailyTarget;

        console.log("===", action.action, actionUpdateValues[action.id]);

        //fix here
        return (
          <div key={action.id} className="mb-6">
            <div className="mb-1 flex items-start max-w-full">
              <span className="flex flex-shrink-0 items-start mt-[3.2px]">
                <ActionIcon
                  type={action.type}
                  size={18}
                  dailyTargetCompleted={isDailyTargetCompleted}
                />
              </span>
              <span className="text-base break-words whitespace-normal w-0 flex-grow">
                {action.action}
              </span>
            </div>
            <div className="flex flex-col text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between border border-muted rounded-md p-2 my-1">
                <span>Daily target</span>

                <span className="ml-2 font-bold flex items-center text-primary">
                  {isNotToday || !actionUpdateValues[action.id] ? (
                    <span>0</span>
                  ) : actionUpdateValues[action.id] >= action.dailyTarget ? (
                    <span className="text-green-500">
                      {actionUpdateValues[action.id]}
                    </span>
                  ) : (
                    <span>{actionUpdateValues[action.id]}</span>
                  )}
                  /{action.dailyTarget}
                </span>
              </div>

              <div className="flex items-center justify-between border border-muted rounded-md p-2 my-1">
                <span>Overall</span>

                <span className="text-primary ml-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <MetricIcon metric={action.metric} size={16} />

                      <span className="ml-1 font-bold flex items-baseline text-primary">
                        {formatNumberSuffixes(
                          action.value + (actionUpdateValues[action.id] || 0)
                        )}
                        {action.metric === "count" ? "" : " h"}
                      </span>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
