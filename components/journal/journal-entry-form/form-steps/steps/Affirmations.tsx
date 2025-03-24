import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { StepScoreDisplay } from "../StepScoreDisplay";
import { TextAreaList } from "@components/ui/textarea-list";
import type { JournalEntry } from "@models/types";

export function Affirmations() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const affirmations = watch("dayEntry.affirmations");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("dayEntry.affirmations", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="Daily Affirmations"
      description="Use 'I am...' statements using powerful words and phrases to imprint on your subconscious mind."
      scoreSection={
        <StepScoreDisplay items={affirmations ?? []} scoreName="Confidence" />
      }
    >
      <TextAreaList
        entryList={affirmations ?? []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
