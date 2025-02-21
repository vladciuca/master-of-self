"use client";

import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Checkbox } from "@components/ui/checkbox";
import { useState, useEffect } from "react";

type HowGreatWasTodayProps = {
  greatToday: string[];
  onHowGreatTodayChange: (howGreatToday: string[]) => void;
  initialHowGreatToday?: string[];
};

export function HowGreatWasToday({
  greatToday,
  onHowGreatTodayChange,
  initialHowGreatToday = [],
}: HowGreatWasTodayProps) {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const initialCheckedState = greatToday.reduce((acc, item) => {
      acc[item] = initialHowGreatToday.includes(item);
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedState);
  }, [greatToday, initialHowGreatToday]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [item]: !prev[item] };

      const newHowGreatToday = greatToday.filter(
        (greatItem) => newCheckedItems[greatItem]
      );
      onHowGreatTodayChange(newHowGreatToday);

      return newCheckedItems;
    });
  };

  return (
    <FormStepTemplate
      title="How great was today?"
      description="Mark the goals you dedicated Willpower to and completed today."
    >
      <ol className="list-decimal py-2 mt-2 mx-4 space-y-3">
        {greatToday.map((item, index) => (
          <li key={index} className="flex items-top justify-between">
            <div className="flex items-top text-base">
              <div className={`${checkedItems[item] ? "text-green-500" : ""}`}>
                {index + 1}.
              </div>
              <span
                // className={`ml-1 mr-2 ${
                //   checkedItems[item] ? "line-through" : ""
                // }`}
                className="ml-1 mr-2"
              >
                {item}
              </span>
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
