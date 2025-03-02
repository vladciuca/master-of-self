import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import type { JournalEntry } from "@models/types";

export function DailyHighlights() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const dailyHighlights = watch("nightEntry.dailyHighlights");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.dailyHighlights", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What are today's highlights?"
      description="Build momentum by capturing meaningful events and boost tomorrow's Willpower."
    >
      <TextAreaList
        entryList={dailyHighlights || []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
