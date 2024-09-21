import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";

type DailyHighlightsProps = {
  entryList: string[];
  onChange: (value: string[]) => void;
};

export function DailyHighlights({ entryList, onChange }: DailyHighlightsProps) {
  const handleTextAreaListChange = (newEntries: string[]) => {
    onChange(newEntries);
  };

  return (
    <FormStepTemplate
      title="What are today's highlights?"
      description="Build momentum by capturing meaningful events to boost tomorrow's Willpower."
    >
      <TextAreaList entryList={entryList} onChange={handleTextAreaListChange} />
    </FormStepTemplate>
  );
}
