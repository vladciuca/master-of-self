import React, { useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
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
      title="What will I do to make today great?"
      description="Write down meaningful and achievable goals for the day to generate Willpower."
      scoreSection={
        <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
          {dailyWillpower}
          <FaBoltLightning className="ml-2 text-3xl" />
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
