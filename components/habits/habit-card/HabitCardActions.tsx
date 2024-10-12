import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { formatNumberSuffixes } from "@lib/utils";
import { HabitAction } from "@app/types/types";

type HabitCardActionsProps = {
  actions: HabitAction[];
  actionUpdateValues: { [key: string]: number };
};

export function HabitCardActions({
  actions,
  actionUpdateValues,
}: HabitCardActionsProps) {
  return (
    <div>
      {actions.map((action, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center justify-between pb-2 mb-1 border-b">
            <div className="flex items-center">
              <span className="flex items-center">
                <ActionIcon type={action.type} />
              </span>
              <span className=" text-lg">{action.action}</span>
            </div>
          </div>
          <div className="flex flex-col text-sm text-muted-foreground mb-2">
            <div className="flex items-baseline mx-1 my-1">
              Daily target:
              <span className="ml-1 text-lg font-bold flex items-baseline text-primary">
                {actionUpdateValues[action.id] ? (
                  <span className="text-green-500">
                    {actionUpdateValues[action.id]}
                  </span>
                ) : (
                  <span>0</span>
                )}
                /{action.dailyTarget}
              </span>
            </div>

            <div className="flex items-baseline mx-1">
              Overall:
              <span className="text-primary ml-1">
                <div className="flex items-baseline space-x-2">
                  <div className="flex items-baseline ml-2">
                    <MetricIcon metric={action.metric} size={16} />

                    <span className="ml-1 text-lg font-bold flex items-baseline text-primary">
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
      ))}
    </div>
  );
}
