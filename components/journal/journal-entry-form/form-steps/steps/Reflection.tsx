import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { StepScoreDisplay } from "../StepScoreDisplay";
import { TextAreaList } from "@components/ui/textarea-list";
import type { JournalEntry } from "@models/types";

export function Reflection() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const reflection = watch("nightEntry.reflection");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.reflection", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What have I learned today?"
      description="If you could go back in time and change something, what would it be?"
      scoreSection={
        <StepScoreDisplay items={reflection ?? []} scoreName="Resilience" />
      }
    >
      <TextAreaList
        entryList={reflection ?? []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
