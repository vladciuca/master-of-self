import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import type { TodoItem } from "@/app/types/types";

type DailyHighlightsProps = {
  entryList: TodoItem[];
  onChange: (value: TodoItem[]) => void;
};

export function DailyHighlights({ entryList, onChange }: DailyHighlightsProps) {
  const handleTextAreaListChange = (newEntries: string[]) => {
    const updatedEntries = newEntries.map((text, index) => ({
      id: entryList[index]?.id || `new-${Date.now()}-${index}`,
      text,
    }));
    onChange(updatedEntries);
  };

  return (
    <FormStepTemplate
      title="Daily Highlights"
      description="Review and edit your daily highlights."
    >
      <TextAreaList
        entryList={entryList.map((item) => item.text)}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
