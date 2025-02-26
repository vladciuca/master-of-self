import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { formatNumberSuffixes } from "@lib/utils";
import {
  displayActionValue,
  isDailyTargetCompleted,
  isActionOverCapped,
  getActionValueColor,
} from "@lib/score";
import type { HabitAction, JournalEntryHabitActions } from "@models/types";
import { HabitCardActionText } from "./HabitCardActionText";

type HabitCardActionsProps = {
  actions: HabitAction[];
  habitDefaultActionValues: JournalEntryHabitActions;
  habitActionValues: JournalEntryHabitActions;
  hasNoEntryToday: boolean;
};

export function HabitCardActions({
  actions,
  habitDefaultActionValues,
  habitActionValues,
  hasNoEntryToday,
}: HabitCardActionsProps) {
  return (
    <div>
      {actions.map((action) => {
        const isActionBreak = action.type === "break";

        const actionParams = {
          value: hasNoEntryToday
            ? habitDefaultActionValues[action.id]
            : habitActionValues[action.id] ||
              // if the habit is created after the Journal Entry it will be null resulting in NaN
              // must send values based on ActionType
              displayActionValue({
                value: 0,
                dailyTarget: action.dailyTarget,
                isActionBreak,
              }),
          dailyTarget: action.dailyTarget,
          isActionBreak,
        };

        // For defensive actions, displayValue shows remaining actions (dailyTarget - value)
        // For offensive actions, displayValue shows completed actions (value)
        const displayValue = displayActionValue(actionParams);

        const dailyTargetCompleted = isDailyTargetCompleted(actionParams);

        const isDailyOverCapped = isActionOverCapped(actionParams);

        return (
          <div key={action.id} className="mt-6">
            <HabitCardActionText
              actionName={action.action}
              actionIcon={
                <ActionIcon
                  type={action.type}
                  size={16}
                  dailyTargetCompleted={dailyTargetCompleted}
                  overCapped={isDailyOverCapped}
                />
              }
              actionType={action.type}
            />
            <div className="flex flex-col text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between border border-muted rounded-md p-2 my-1">
                Daily {isActionBreak ? "Limit" : "Target"}
                <span className="ml-2 font-bold flex items-center text-primary">
                  <span className={getActionValueColor(actionParams)}>
                    {displayValue}
                  </span>
                  <span className="mx-1">/</span>
                  {action.dailyTarget}
                  <span className="ml-2 font-normal">{action.actionUnit}</span>
                </span>
              </div>

              <div className="flex items-center justify-between border border-muted rounded-md p-2 my-1">
                <span>Overall</span>

                <span className="text-primary ml-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <MetricIcon metric={action.metric} size={16} />

                      <span className="ml-1 font-bold flex items-baseline text-primary">
                        {formatNumberSuffixes(action.value + displayValue)}
                      </span>
                      <span className="ml-2">{action.actionUnit}</span>
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
