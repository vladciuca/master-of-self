import { ActionIcon } from "@components/habits/HabitActionFragments";
import { Badge } from "@/components/ui/badge";
import { Hash, Clock } from "lucide-react";
import { Action } from "@app/types/types";

type HabitCardActionsProps = {
  actions: Action[];
};

export function HabitCardActions({ actions }: HabitCardActionsProps) {
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
            <div className="flex items-center space-x-2">
              <div className="text-xl flex items-center">
                <span className="font-bold flex items-center">
                  {action.value}
                  {action.metric === "count" ? "" : " h"}
                </span>
                {action.metric === "count" ? (
                  <Hash size={18} className="ml-1" />
                ) : (
                  <Clock size={18} className="ml-1" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <Badge variant="secondary" className="capitalize">
              {action.type}
            </Badge>
            <span>+10 XP</span>
          </div>
        </div>
      ))}
    </div>
  );
}
