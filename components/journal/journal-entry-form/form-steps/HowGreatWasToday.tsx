"use client";

import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Checkbox } from "@components/ui/checkbox";
import { useState, useEffect } from "react";

type HowGreatWasTodayProps = {
  greatToday: string[];
  onHighlightsChange: (highlights: string[]) => void;
  initialHighlights?: string[];
};

export function HowGreatWasToday({
  greatToday,
  onHighlightsChange,
  initialHighlights = [],
}: HowGreatWasTodayProps) {
  // State to track checked items
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Initialize checkedItems based on initialHighlights
  useEffect(() => {
    const initialCheckedState = greatToday.reduce((acc, item) => {
      acc[item] = initialHighlights.includes(item);
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedState);
  }, [greatToday, initialHighlights]);

  // Handle checkbox change
  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [item]: !prev[item] };

      // Update highlights based on the changed item
      if (newCheckedItems[item]) {
        // If the item is now checked, add it to highlights if it's not already there
        if (!initialHighlights.includes(item)) {
          onHighlightsChange([...initialHighlights, item]);
        }
      } else {
        // If the item is now unchecked, remove it from highlights
        onHighlightsChange(
          initialHighlights.filter((highlight) => highlight !== item)
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
          <li key={index} className="flex items-top justify-between">
            <div className="flex items-top text-base">
              <div className={`${checkedItems[item] ? "text-green-500" : ""}`}>
                {index + 1}.
              </div>
              <span className="ml-1 mr-2">{item}</span>
            </div>

            <Checkbox
              id={`checkbox-${index}`}
              className="h-8 w-8"
              checked={checkedItems[item] || false}
              onCheckedChange={() => handleCheckboxChange(item)}
            />
          </li>
        ))}
      </ol>
    </FormStepTemplate>
  );
}
