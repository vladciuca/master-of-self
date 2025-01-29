import React, { useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { FaBoltLightning } from "react-icons/fa6";
import type { TodoItem } from "@/app/types/types";

type GreatTodayProps = {
  dailyWillpower: number;
  entryList: TodoItem[];
  onChange: (value: TodoItem[]) => void;
};

function GreatToday({ dailyWillpower, entryList, onChange }: GreatTodayProps) {
  const handleTextAreaListChange = useCallback(
    (newEntries: string[]) => {
      const updatedEntries = newEntries.map((text) => ({
        id: crypto.randomUUID(),
        text,
      }));
      onChange(updatedEntries);
    },
    [onChange]
  );

  return (
    <FormStepTemplate
      title="What will I do to make today great?"
      description="Write down meaningful and achievable goals for the day to generate Willpower."
      scoreSection={
        <>
          {dailyWillpower}
          <FaBoltLightning className="ml-2 text-3xl" />
        </>
      }
    >
      <TextAreaList
        entryList={entryList.map((item) => item.text)}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}

GreatToday.displayName = "GreatToday";

const MemoizedGratefulFor = React.memo(GreatToday, (prevProps, nextProps) => {
  return (
    prevProps.dailyWillpower === nextProps.dailyWillpower &&
    JSON.stringify(prevProps.entryList) ===
      JSON.stringify(nextProps.entryList) &&
    prevProps.onChange === nextProps.onChange
  );
});

export { MemoizedGratefulFor as GreatToday };
