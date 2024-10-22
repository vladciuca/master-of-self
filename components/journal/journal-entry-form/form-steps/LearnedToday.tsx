import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { Textarea } from "@components/ui/textarea";

type LearnedTodayProps = {
  entryList: string[];
  onChange: (value: string[]) => void;
};

export function LearnedToday({ entryList, onChange }: LearnedTodayProps) {
  const handleTextAreaListChange = (newEntries: string[]) => {
    onChange(newEntries);
  };
  return (
    <FormStepTemplate
      title="What have I learned today?"
      description="If you could go back in time and change something, what would it be?"
    >
      {/* <Textarea
        value={learnedToday}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-0 text-base resize-none flex-grow h-full border-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      /> */}
      <TextAreaList entryList={entryList} onChange={handleTextAreaListChange} />
    </FormStepTemplate>
  );
}
