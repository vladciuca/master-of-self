import { ActionIcon } from "@components/habits/habit-actions/HabitActionIcon";
// import { Badge } from "@/components/ui/badge";
import { Hash, Clock } from "lucide-react";
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
                {/* <Badge variant="secondary" className="mr-2">
                  {action.type === "offensive" ? "I will" : "I won't"}
                </Badge> */}
              </span>
              <span className=" text-lg">{action.action}</span>
            </div>
          </div>
          <div className="flex flex-col text-sm text-muted-foreground mb-2">
            {/* <Badge variant="secondary" className="capitalize">
              {action.type}
            </Badge> */}

            <div className="flex items-baseline mx-1 my-1">
              Daily target:
              <span className="ml-1 text-xl font-bold flex items-baseline text-primary">
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
                    <span className="flex items-baseline">
                      {action.metric === "count" ? (
                        <Hash size={16} className="text-primary" />
                      ) : (
                        <Clock size={16} className="text-primary" />
                      )}
                    </span>

                    <span className="ml-1 text-xl font-bold flex items-baseline text-primary">
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
