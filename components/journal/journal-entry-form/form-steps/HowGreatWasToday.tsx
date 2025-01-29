"use client";

import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Checkbox } from "@components/ui/checkbox";
import { useState, useEffect } from "react";
import type { TodoItem } from "@/app/types/types";

type HowGreatWasTodayProps = {
  greatToday: TodoItem[];
  onHighlightsChange: (highlights: TodoItem[]) => void;
  initialHighlights?: TodoItem[];
};

export function HowGreatWasToday({
  greatToday,
  onHighlightsChange,
  initialHighlights = [],
}: HowGreatWasTodayProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const initialCheckedState = greatToday.reduce((acc, item) => {
      acc[item.id] = initialHighlights.some(
        (highlight) => highlight.id === item.id
      );
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedState);
  }, [greatToday, initialHighlights]);

  const handleCheckboxChange = (item: TodoItem) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [item.id]: !prev[item.id] };

      if (newCheckedItems[item.id]) {
        if (!initialHighlights.some((highlight) => highlight.id === item.id)) {
          onHighlightsChange([...initialHighlights, item]);
        }
      } else {
        onHighlightsChange(
          initialHighlights.filter((highlight) => highlight.id !== item.id)
        );
      }

      return newCheckedItems;
    });
  };

  return (
    <FormStepTemplate
      title="How great was today?"
      description="Add any completed daily goals as highlights for today."
    >
      <ol className="list-decimal py-2 mt-2 mx-4 space-y-3">
        {greatToday.map((item, index) => (
          <li key={item.id} className="flex items-top justify-between">
            <div className="flex items-top text-base">
              <div
                className={`${checkedItems[item.id] ? "text-green-500" : ""}`}
              >
                {index + 1}.
              </div>
              <span
                className={`ml-1 mr-2 ${
                  checkedItems[item.id] ? "line-through" : ""
                }`}
              >
                {item.text}
              </span>
            </div>

            <Checkbox
              id={`checkbox-${item.id}`}
              className="h-8 w-8"
              checked={checkedItems[item.id] || false}
              onCheckedChange={() => handleCheckboxChange(item)}
            />
          </li>
        ))}
      </ol>
    </FormStepTemplate>
  );
}
