import { useFormContext } from "react-hook-form";
import { FormStepTemplate } from "@components/journal/journal-entry-form/form-steps/FormStepTemplate";
import { TextAreaList } from "@components/ui/textarea-list";
import { StepScoreDisplay } from "../StepScoreDisplay";
import type { JournalEntry } from "@models/types";

export function Highlights() {
  const { watch, setValue } = useFormContext<JournalEntry>();

  const highlights = watch("nightEntry.highlights");

  const handleTextAreaListChange = (newEntries: string[]) => {
    setValue("nightEntry.highlights", newEntries, {
      shouldDirty: true,
    });
  };

  return (
    <FormStepTemplate
      title="What are today's highlights?"
      description="Build momentum by capturing meaningful events and boost Awareness."
      scoreSection={
        <StepScoreDisplay items={highlights ?? []} scoreName="Awareness" />
      }
    >
      <TextAreaList
        entryList={highlights ?? []}
        onChange={handleTextAreaListChange}
      />
    </FormStepTemplate>
  );
}
