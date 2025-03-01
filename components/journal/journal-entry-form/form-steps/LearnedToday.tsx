import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import type { JournalEntry } from "@models/types";

export function LearnedToday() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const learnedToday = watch("nightEntry.learnedToday");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.learnedToday", newEntries, {
      // shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What have I learned today?"
      description="If you could go back in time and change something, what would it be?"
    >
      <TextAreaList
        entryList={learnedToday || []}
        // value={dailyHighlights || [""]}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
