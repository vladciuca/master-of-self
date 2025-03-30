"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { StepScoreDisplay } from "../StepScoreDisplay";
// import { Badge } from "@components/ui/badge";
import { Checkbox } from "@components/ui/checkbox";
import { calculateStepScoreMultiplier } from "@lib/score";
import { JOURNAL_COLORS } from "@lib/colors";
import type { JournalEntry } from "@models/types";

export function Night() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const day = watch("dayEntry.day") || [];
  const night = watch("nightEntry.night") || [];

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  console.log("=========checkedItems", checkedItems);

  useEffect(() => {
    const initialCheckedState = day.reduce((acc, item) => {
      acc[item] = night.includes(item);
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(initialCheckedState);
  }, [day, night]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [item]: !prev[item] };

      const newHowGreatToday = day.filter(
        (dayItem) => newCheckedItems[dayItem]
      );

      setValue("nightEntry.night", newHowGreatToday, {
        // shouldValidate: true,
        shouldDirty: true,
      });

      return newCheckedItems;
    });
  };

  return (
    <FormStepTemplate
      title="How great was today?"
      // description="Mark the goals you dedicated Willpower to and completed today."
      description="Follow through with your daily goals to exponentially increase Motivation."
      scoreSection={
        <div className="flex items-center">
          <StepScoreDisplay items={day ?? []} scoreName="Motivation" />
          {Object.values(checkedItems).filter(Boolean).length + 1 <= 1 ? (
            <></>
          ) : (
            <span className={`text-${JOURNAL_COLORS.score} flex items-center`}>
              <span className="ml-2 mr-[2px] text-2xl">x</span>
              {calculateStepScoreMultiplier(night)}
            </span>
          )}
        </div>
      }
    >
      <ol className="list-decimal py-2 mt-2 mx-4 space-y-3">
        {day.map((item, index) => (
          <li key={index} className="flex w-full">
            <div className="inline-flex text-base flex-grow w-[90%]">
              {/* <div className="w-1/6">
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
              </div> */}
              <div
                className={`mr-1 ${
                  checkedItems[item]
                    ? `text-${JOURNAL_COLORS.score}`
                    : "text-primary"
                }`}
              >
                <div className="h-full w-full flex justify-center items-start">
                  {index + 1}.
                </div>
              </div>

              <span className="break-words w-5/6 text-left">{item}</span>
            </div>

            <div className="flex justify-end">
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
