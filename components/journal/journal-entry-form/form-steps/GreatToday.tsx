import React, { useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/TextAreaList";
import { FaBoltLightning } from "react-icons/fa6";

type GreatTodayProps = {
  dailyWillpower: number;
  entryList: string[];
  onChange: (value: string[]) => void;
};

function GreatToday({ dailyWillpower, entryList, onChange }: GreatTodayProps) {
  const handleTextAreaListChange = useCallback(
    (newEntries: string[]) => {
      onChange(newEntries);
    },
    [onChange]
  );

  return (
    <FormStepTemplate
      title="What are today's highlights?"
      description="Build momentum by capturing meaningful events to boost tomorrow's Willpower."
      scoreSection={
        <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
          {dailyWillpower}
          <FaBoltLightning className="ml-2" />
        </div>
      }
    >
      <TextAreaList entryList={entryList} onChange={handleTextAreaListChange} />
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
