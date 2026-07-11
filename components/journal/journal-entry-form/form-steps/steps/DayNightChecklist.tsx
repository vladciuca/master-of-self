"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MoreHorizontal } from "lucide-react";

import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { StepScoreDisplay } from "@components/journal/journal-entry-form/form-steps/StepScoreDisplay";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { JOURNAL_COLORS } from "@lib/colors";
import { calculateStepScoreMultiplier } from "@lib/score";
import { cn } from "@lib/utils";
import type { JournalEntry } from "@models/types";

type DayNightChecklistProps = {
  mode: "day" | "night";
};

function toggleInArray(arr: string[] = [], value: string): string[] {
  return arr.includes(value)
    ? arr.filter((item) => item !== value)
    : [...arr, value];
}

function replaceInArray(
  arr: string[] = [],
  oldValue: string,
  newValue: string
): string[] {
  return arr.map((item) => (item === oldValue ? newValue : item));
}

function removeFromArray(arr: string[] = [], value: string): string[] {
  return arr.filter((item) => item !== value);
}

export function DayNightChecklist({ mode }: DayNightChecklistProps) {
  const isDay = mode === "day";
  const { control, setValue } = useFormContext<JournalEntry>();

  const day = useWatch({ name: "dayEntry.day", control }) ?? [];
  const night = useWatch({ name: "nightEntry.night", control }) ?? [];
  const carryOver = useWatch({ name: "dayEntry.carryOver", control }) ?? [];
  const repeat = useWatch({ name: "dayEntry.repeat", control }) ?? [];

  const [draft, setDraft] = React.useState("");
  const [focusTarget, setFocusTarget] = React.useState<
    { index: number } | "new" | null
  >(null);

  const itemRefs = React.useRef<(HTMLTextAreaElement | null)[]>([]);
  const newItemRef = React.useRef<HTMLTextAreaElement | null>(null);
  const editingItems = React.useRef<Map<number, string>>(new Map());
  const hasCleanedEmptyItems = React.useRef(false);
  const hasInitialFocused = React.useRef(false);

  React.useEffect(() => {
    if (hasCleanedEmptyItems.current) return;
    hasCleanedEmptyItems.current = true;

    const cleanedDay = day.filter((item) => item.trim() !== "");
    if (cleanedDay.length !== day.length) {
      setValue("dayEntry.day", cleanedDay, { shouldDirty: true });
    }
  }, [day, setValue]);

  const resizeTextarea = React.useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    []
  );

  React.useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, day.length);
  }, [day.length]);

  React.useLayoutEffect(() => {
    itemRefs.current.forEach((el) => {
      if (el && document.contains(el)) {
        resizeTextarea(el);
      }
    });
  }, [day, resizeTextarea]);

  React.useEffect(() => {
    if (!focusTarget) return;

    const id = window.setTimeout(() => {
      if (focusTarget === "new") {
        newItemRef.current?.focus();
      } else {
        const el = itemRefs.current[focusTarget.index];
        if (el) {
          el.focus();
          const length = el.value.length;
          el.setSelectionRange(length, length);
        }
      }

      setFocusTarget(null);
    }, 0);

    return () => window.clearTimeout(id);
  }, [focusTarget]);

  React.useLayoutEffect(() => {
    if (!isDay || hasInitialFocused.current) return;

    hasInitialFocused.current = true;

    if (day.length === 0) {
      newItemRef.current?.focus();
    } else {
      const lastIndex = day.length - 1;
      const el = itemRefs.current[lastIndex];
      if (el) {
        el.focus();
        const length = el.value.length;
        el.setSelectionRange(length, length);
      }
    }
  }, [isDay, day.length]);

  const addItem = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setValue("dayEntry.day", [...day, trimmed], { shouldDirty: true });
  };

  const commitDraft = () => {
    if (draft.trim()) {
      addItem(draft);
      setDraft("");
    }
  };

  const updateItem = (index: number, newText: string) => {
    const oldText = day[index];
    if (oldText === newText) return;

    const newDay = [...day];
    newDay[index] = newText;
    setValue("dayEntry.day", newDay, { shouldDirty: true });
  };

  const updateItemOnBlur = (index: number, newText: string, originalText: string) => {
    const newDay = [...day];
    newDay[index] = newText;
    setValue("dayEntry.day", newDay, { shouldDirty: true });

    setValue("nightEntry.night", replaceInArray(night, originalText, newText), {
      shouldDirty: true,
    });
    setValue("dayEntry.carryOver", replaceInArray(carryOver, originalText, newText), {
      shouldDirty: true,
    });
    setValue("dayEntry.repeat", replaceInArray(repeat, originalText, newText), {
      shouldDirty: true,
    });
  };

  const deleteItem = (index: number, textToDelete: string, shouldRefocus = true) => {
    const newDay = day.filter((_, i) => i !== index);

    setValue("dayEntry.day", newDay, { shouldDirty: true });
    setValue("nightEntry.night", removeFromArray(night, textToDelete), {
      shouldDirty: true,
    });
    setValue("dayEntry.carryOver", removeFromArray(carryOver, textToDelete), {
      shouldDirty: true,
    });
    setValue("dayEntry.repeat", removeFromArray(repeat, textToDelete), {
      shouldDirty: true,
    });

    if (shouldRefocus) {
      if (newDay.length === 0) {
        setFocusTarget("new");
      } else {
        const targetIndex = Math.max(0, index - 1);
        setFocusTarget({ index: targetIndex });
      }
    }
  };

  const toggleItemChecked = (item: string) => {
    setValue("nightEntry.night", toggleInArray(night, item), {
      shouldDirty: true,
    });
  };

  const toggleCarryOver = (item: string) => {
    setValue("dayEntry.carryOver", toggleInArray(carryOver, item), {
      shouldDirty: true,
    });
  };

  const toggleRepeat = (item: string) => {
    setValue("dayEntry.repeat", toggleInArray(repeat, item), {
      shouldDirty: true,
    });
  };

  React.useEffect(() => {
    resizeTextarea(newItemRef.current);
  }, [draft, resizeTextarea]);

  const scoreSection = isDay ? (
    <StepScoreDisplay items={[...day, draft]} scoreName="Motivation" />
  ) : (
    <div className="flex items-center">
      <div>Motivation</div>
      {night.length + 1 <= 1 ? null : (
        <span className={`text-${JOURNAL_COLORS.score} flex items-center`}>
          <span className="ml-2 mr-[2px] text-2xl">x</span>
          {calculateStepScoreMultiplier(night)}
        </span>
      )}
    </div>
  );

  return (
    <JournalStepTemplate
      title={
        isDay
          ? "What will I do to make today great?"
          : "How great was today?"
      }
      description={
        isDay
          ? "Write down meaningful and achievable goals for the day to build Motivation."
          : "Follow through with your daily goals to exponentially increase Motivation."
      }
      scoreSection={scoreSection}
    >
      <div className="space-y-1">
        {day.map((item, index) => {
          const checked = night.includes(item);
          const isCarryOver = carryOver.includes(item);
          const isRepeat = repeat.includes(item);

          return (
            <div
              key={`checklist-item-${index}`}
              className={cn(
                "flex items-start gap-3 rounded-md px-2 py-1"
              )}
            >
              <Checkbox
                id={`checklist-checkbox-${mode}-${index}`}
                aria-label={checked ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full border-muted-foreground/50 bg-transparent",
                  "data-[state=checked]:bg-primary",
                  "data-[state=checked]:border-primary"
                )}
                checked={checked}
                onCheckedChange={() => toggleItemChecked(item)}
              />

              {isDay ? (
                <textarea
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  value={item}
                  rows={1}
                  onChange={(e) => {
                    updateItem(index, e.target.value);
                    resizeTextarea(e.target);
                  }}
                  onFocus={() => {
                    editingItems.current.set(index, item);
                  }}
                  onBlur={(e) => {
                    const trimmed = e.target.value.trim();
                    const originalText = editingItems.current.get(index) ?? item;
                    if (trimmed === "") {
                      deleteItem(index, originalText, false);
                    } else {
                      updateItemOnBlur(index, trimmed, originalText);
                    }
                    editingItems.current.delete(index);
                  }}
                  onKeyDown={(e) => {
                    const value = e.currentTarget.value;
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (value.trim()) {
                        setFocusTarget("new");
                      }
                    }
                    if (
                      (e.key === "Backspace" || e.key === "Delete") &&
                      value.trim() === ""
                    ) {
                      e.preventDefault();
                      const originalText = editingItems.current.get(index) ?? item;
                      deleteItem(index, originalText);
                    }
                  }}
                  className={cn(
                    "flex-1 resize-none overflow-hidden m-0 p-0 bg-transparent text-base outline-none",
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-primary"
                  )}
                  style={{ height: "auto" }}
                />
              ) : (
                <span
                  className={cn(
                    "flex-1 break-words text-base",
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-primary"
                  )}
                >
                  {item}
                </span>
              )}

              {!isDay && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Item options"
                      className="h-7 w-7 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={isCarryOver}
                      onCheckedChange={() => toggleCarryOver(item)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      Carry over to tomorrow
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={isRepeat}
                      onCheckedChange={() => toggleRepeat(item)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      Repeat daily
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}

        {isDay && (
          <div className="flex items-start gap-3 rounded-md px-2 py-1">
            <div className="h-5 w-5 shrink-0 rounded-full border border-muted-foreground/50 bg-transparent" />
            <textarea
              ref={newItemRef}
              value={draft}
              rows={1}
              placeholder="Add a new daily goal..."
              onChange={(e) => {
                setDraft(e.target.value);
                resizeTextarea(e.target);
              }}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                const value = e.currentTarget.value;
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitDraft();
                }
                if (
                  (e.key === "Backspace" || e.key === "Delete") &&
                  value.trim() === "" &&
                  day.length > 0
                ) {
                  e.preventDefault();
                  setFocusTarget({ index: day.length - 1 });
                }
              }}
              className="flex-1 resize-none overflow-hidden m-0 p-0 bg-transparent text-base text-primary placeholder:text-muted-foreground outline-none"
              style={{ height: "auto" }}
            />
          </div>
        )}
      </div>
    </JournalStepTemplate>
  );
}
