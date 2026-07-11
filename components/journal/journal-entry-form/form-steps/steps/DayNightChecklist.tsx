"use client";

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FaRedoAlt } from "react-icons/fa";

import { JournalStepTemplate } from "@components/journal/journal-entry-form/form-steps/steps/journal-step/JournalStepTemplate";
import { StepScoreDisplay } from "@components/journal/journal-entry-form/form-steps/StepScoreDisplay";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
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
  newValue: string,
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

  const resizeTextarea = React.useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

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

  const updateItemOnBlur = (
    index: number,
    newText: string,
    originalText: string,
  ) => {
    const newDay = [...day];
    newDay[index] = newText;
    setValue("dayEntry.day", newDay, { shouldDirty: true });

    setValue("nightEntry.night", replaceInArray(night, originalText, newText), {
      shouldDirty: true,
    });
    setValue(
      "dayEntry.carryOver",
      replaceInArray(carryOver, originalText, newText),
      {
        shouldDirty: true,
      },
    );
  };

  const deleteItem = (
    index: number,
    textToDelete: string,
    shouldRefocus = true,
  ) => {
    const newDay = day.filter((_, i) => i !== index);

    setValue("dayEntry.day", newDay, { shouldDirty: true });
    setValue("nightEntry.night", removeFromArray(night, textToDelete), {
      shouldDirty: true,
    });
    setValue("dayEntry.carryOver", removeFromArray(carryOver, textToDelete), {
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
        isDay ? "What will I do to make today great?" : "How great was today?"
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

          return (
            <div
              key={`checklist-item-${index}`}
              className="flex items-start gap-1 rounded-md px-2 py-1"
            >
              <Checkbox
                id={`checklist-checkbox-${mode}-${index}`}
                aria-label={checked ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full border-muted-foreground/50 bg-transparent",
                  "data-[state=checked]:bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)]",
                  "data-[state=checked]:bg-origin-border",
                  "data-[state=checked]:border-transparent",
                  "data-[state=checked]:text-white",
                )}
                checked={checked}
                onCheckedChange={() => toggleItemChecked(item)}
              />

              {isDay && isCarryOver && (
                <span
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-black"
                  aria-label="Carry over to tomorrow"
                  title="Carry over to tomorrow"
                >
                  <FaRedoAlt className="h-3.5 w-3.5" />
                </span>
              )}

              <span className="inline-flex h-5 w-5 mt-0.5 shrink-0 items-center justify-end text-base">
                {index + 1}.
              </span>

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
                    const originalText =
                      editingItems.current.get(index) ?? item;
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
                      const originalText =
                        editingItems.current.get(index) ?? item;
                      deleteItem(index, originalText);
                    }
                  }}
                  className={cn(
                    "flex-1 resize-none overflow-hidden m-0 p-0 bg-transparent text-base outline-none",
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-primary",
                  )}
                  style={{ height: "auto" }}
                />
              ) : (
                <span
                  className={cn(
                    "flex-1 break-words text-base",
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-primary",
                  )}
                >
                  {item}
                </span>
              )}

              {!isDay && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={
                    isCarryOver
                      ? "Do not carry over to tomorrow"
                      : "Carry over to tomorrow"
                  }
                  title={
                    isCarryOver
                      ? "Do not carry over to tomorrow"
                      : "Carry over to tomorrow"
                  }
                  onClick={() => toggleCarryOver(item)}
                  className={cn(
                    "h-6 w-6 shrink-0 rounded-full",
                    isCarryOver
                      ? "bg-white text-black hover:bg-white/90 hover:text-black"
                      : "bg-transparent text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <FaRedoAlt className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}

        {isDay && (
          <div className="flex items-start gap-1 rounded-md px-2 py-1">
            <div className="h-5 w-5 shrink-0 rounded-full border border-muted-foreground/50 bg-transparent" />
            <span className="w-1 shrink-0" />
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
