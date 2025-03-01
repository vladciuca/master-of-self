"use client";

import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { Badge } from "@components/ui/badge";
import { Checkbox } from "@components/ui/checkbox";
import { useState, useEffect } from "react";
import type { JournalEntry } from "@models/types";

export function HowGreatWasToday() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const greatToday = watch("dayEntry.greatToday") || [];
  const howGreatToday = watch("nightEntry.howGreatToday") || [];

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const initialCheckedState = greatToday.reduce((acc, item) => {
      acc[item] = howGreatToday.includes(item);
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedState);
  }, [greatToday, howGreatToday]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [item]: !prev[item] };

      const newHowGreatToday = greatToday.filter(
        (greatItem) => newCheckedItems[greatItem]
      );

      setValue("nightEntry.howGreatToday", newHowGreatToday, {
        // shouldValidate: true,
        shouldDirty: true,
      });

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
          <li key={index} className="flex justify-between w-full">
            <div className="inline-flex text-base w-5/6">
              <div className="w-1/6">
                <Badge
                  className={`h-[30px] w-[30px] text-base text-primary bg-transparent hover:bg-transparent ${
                    checkedItems[item]
                      ? "bg-[linear-gradient(to_right,_#eab308_50%,_#a855f7_50%)] bg-origin-border"
                      : ""
                  }`}
                >
                  <div className="h-full w-full flex justify-center items-center">
                    {index + 1}.
                  </div>
                </Badge>
              </div>

              <span className="break-words w-5/6 text-left mt-1">{item}</span>
            </div>

            <div className="flex justify-end w-1/6">
              <Checkbox
                id={`checkbox-${index}`}
                className="h-8 w-8"
                checked={checkedItems[item] || false}
                onCheckedChange={() => handleCheckboxChange(item)}
              />
            </div>
          </li>
        ))}
      </ol>
    </FormStepTemplate>
  );
}
