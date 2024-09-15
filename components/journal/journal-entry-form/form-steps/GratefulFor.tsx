import React, { useCallback } from "react";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/TextAreaList";
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
          <FaBoltLightning className="ml-2" />
        </div>
      }
    >
      <TextAreaList entryList={entryList} onChange={handleTextAreaListChange} />
    </FormStepTemplate>
  );

  // return (
  //   <div className="h-full flex flex-col">
  //     <Label className="w-full flex flex-col h-full mt-2">
  //       <div className="text-center sticky top-0 bg-background z-10">
  //         <div className="leading-relaxed text-muted-foreground mx-4">
  //           {
  //             "Use details to describe what you're feeling grateful for to generate Willpower."
  //           }
  //         </div>
  //         <div className="text-4xl mt-3 flex items-center justify-center font-semibold">
  //           {dailyWillpower}
  //           <FaBoltLightning className="ml-2" />
  //         </div>
  //       </div>
  //       <div className="flex-grow overflow-y-auto h-full mt-4 mx-4">
  //         <TextAreaList
  //           entryList={entryList}
  //           onChange={handleTextAreaListChange}
  //         />
  //       </div>
  //     </Label>
  //   </div>
  // );
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
