import React, { useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { FaBoltLightning } from "react-icons/fa6";

type GratefulForProps = {
  dailyWillpower: number;
  entryList: string[];
  onChange: (value: string[]) => void;
};

function GratefulFor({
  dailyWillpower,
  entryList,
  onChange,
}: GratefulForProps) {
  const handleTextAreaListChange = useCallback(
    (newEntries: string[]) => {
      onChange(newEntries);
    },
    [onChange]
  );

  return (
    <FormStepTemplate
      title="What am I feeling grateful for?"
      description="Use details to describe what you're feeling grateful for to generate Willpower."
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

GratefulFor.displayName = "GratefulFor";

const MemoizedGratefulFor = React.memo(GratefulFor, (prevProps, nextProps) => {
  return (
    prevProps.dailyWillpower === nextProps.dailyWillpower &&
    JSON.stringify(prevProps.entryList) ===
      JSON.stringify(nextProps.entryList) &&
    prevProps.onChange === nextProps.onChange
  );
});

export { MemoizedGratefulFor as GratefulFor };
