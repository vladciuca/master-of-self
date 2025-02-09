import {
  ActionIcon,
  MetricIcon,
} from "@components/habits/habit-actions/HabitActionIcons";
import { formatNumberSuffixes } from "@lib/utils";
import {
  getActionValueWithFallback,
  displayActionValue,
  isDailyTargetCompleted,
  isActionOverCapped,
  getValueColor,
} from "@lib/score";
import type { HabitAction, ActionItem } from "@app/types/types";

type HabitCardActionsProps = {
  actions: HabitAction[];
  actionUpdateValues: ActionItem;
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
        const isDefensiveAction = action.type === "defensive";
        const { dailyTarget } = action;
        // const value =
        //   actionUpdateValues[action.id] ??
        //   (isDefensiveAction ? action.dailyTarget : 0);
        const actionValueParams = { action, actionUpdateValues };
        const value = getActionValueWithFallback(actionValueParams);
        const actionParams = { value, dailyTarget, isDefensiveAction };

        // For defensive actions, displayValue shows remaining actions (dailyTarget - value)
        // For offensive actions, displayValue shows completed actions (value)
        const displayValue = displayActionValue(actionParams);

        const dailyTargetCompleted =
          !isNotToday && isDailyTargetCompleted(actionParams);

        const isDailyOverCapped =
          !isNotToday && isActionOverCapped(actionParams);

        return (
          <div key={action.id} className="mb-6">
            <div className="mb-1 flex items-start max-w-full">
              <span className="flex flex-shrink-0 items-start mt-[3.2px]">
                <ActionIcon
                  type={action.type}
                  size={18}
                  dailyTargetCompleted={dailyTargetCompleted}
                  overCapped={isDailyOverCapped}
                />
              </span>
              <span className="text-base font-bold mr-2">
                {isDefensiveAction ? "I won't" : "I will"}
              </span>
              <span className="text-base break-words whitespace-normal w-0 flex-grow">
                {action.action}
              </span>
            </div>
            <div className="flex flex-col text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between border border-muted rounded-md p-2 my-1">
                Daily {isDefensiveAction ? "Limit" : "Target"}:
                <span className="ml-2 font-bold flex items-center text-primary">
                  {isNotToday ? (
                    <span>0</span>
                  ) : (
                    <span className={getValueColor(actionParams)}>
                      {displayValue}
                    </span>
                  )}
                  /{action.dailyTarget}
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
                        {/* {formatNumberSuffixes(action.value + value)} */}
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
