import { HabitCardActionText } from "@components/habits/habit-card/HabitCardActionText";
import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { DeleteActionButton } from "./DeleteActionButton";
import { Button } from "@/components/ui/button";

import { FilePenLine } from "lucide-react";

import { HABIT_COLORS } from "@lib/colors";

import type { HabitAction } from "@models/types";

type ActionFieldItemProps = {
  action: HabitAction;
  handleRemoveAction: () => void;
  handleEditAction: () => void;
};

export function ActionFieldItem({
  action,
  handleRemoveAction,
  handleEditAction,
}: ActionFieldItemProps) {
  return (
    <>
      <div className="flex items-center max-w-full border-b pb-1 mb-2">
        <HabitCardActionText
          actionTask={action.task}
          actionIcon={<ActionIcon type={action.type} size={18} />}
          actionType={action.type}
        />

        <div>
          <DeleteActionButton
            handleRemoveAction={handleRemoveAction}
            actionName={action.task}
            actionPrefix={action.type === "build" ? "I will" : "I won't"}
            actionIcon={<ActionIcon type={action.type} size={18} />}
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-1">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">
            Daily {action.type === "build" ? "Target" : "Limit"}:
          </span>
          <span className="mx-1">
            <MetricIcon metric={action.metric} size={18} />
          </span>
          {action.dailyTarget} {action.unit}
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={handleEditAction}
          aria-label={`Edit action ${action.task}`}
          className={`h-8 w-8 p-0 text-${HABIT_COLORS.main} hover:text-${HABIT_COLORS.main}`}
        >
          <FilePenLine size={20} />
        </Button>
      </div>
    </>
  );
}
