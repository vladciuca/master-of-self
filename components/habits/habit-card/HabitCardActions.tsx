import { ActionIcon } from "@components/habits/HabitActionFragments";
import { Badge } from "@/components/ui/badge";
import { Hash, Clock } from "lucide-react";
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
          <div className="flex items-center justify-between pb-2 mb-2 border-b">
            <div className="flex items-center">
              <span className="flex items-center">
                <ActionIcon type={action.type} />
                <Badge variant="secondary" className="mr-2">
                  {action.type === "offensive" ? "I will" : "I won't"}
                </Badge>
              </span>
              <span className=" text-lg">{action.action}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            {/* <Badge variant="secondary" className="capitalize">
              {action.type}
            </Badge> */}
            <div className="flex items-center space-x-2">
              <div className="text-xl flex items-center">
                {action.metric === "count" ? (
                  <Hash size={18} className="mr-1 text-primary" />
                ) : (
                  <Clock size={18} className="mr-1 text-primary" />
                )}
                <span className="font-bold flex items-center text-primary">
                  {action.value}
                  {actionUpdateValues[action.id] ? (
                    <span className="text-green-500 ml-1">
                      +{actionUpdateValues[action.id]}
                    </span>
                  ) : (
                    <></>
                  )}
                  {action.metric === "count" ? "" : " h"}
                </span>
              </div>
            </div>
            <span className="text-green-500">
              +
              {actionUpdateValues[action.id]
                ? action.value + actionUpdateValues[action.id]
                : action.value}
              <span className="text-primary mx-1">XP</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
